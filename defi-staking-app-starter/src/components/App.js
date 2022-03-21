import React, {Component} from 'react';
import './App.css'
import Navbar from './Navbar';
import Web3 from 'web3';
import Tether from '../truffle_abis/Tether.json';
import RWD from '../truffle_abis/RWD.json';
import DecentralBank from '../truffle_abis/DecentralBank.json';
import Main from './Main'
import ParticleSettings from './ParticleSettings'


class App extends Component {

    // We want to connect to wallet before the component mounts
    async UNSAFE_componentWillMount() {
        await this.loadWeb3()
        await this.loadBlockchainData()
    }

    // this function connects app to meta mask
    async loadWeb3() {
        // window.ethereum is injected into the page by metamask
        if(window.ethereum) {
            // window.web3 appears to be a pre-existing empty object which is then assigned the new Web3 object
            window.web3 = new Web3(window.ethereum)
            // requests accounts from metamask
            await window.ethereum.request({ method: 'eth_requestAccounts' })
        // grabs wallet if your wallet is not metamask
        } else if(window.web3) {
                window.web3 = new Web3(window.web3.currentProvider)
            } else {
                window.alert('No ethereum browser detected. Check out MetaMask.')
            }
        }
    
    async loadBlockchainData() {
        // web3 is made my Web3 object which is populated by metamask
        const web3 = window.web3
        // grabs accounts from meta mask [but is only grabbing one, I think this is a problem]
        const account = await web3.eth.getAccounts()
        this.setState({account: account[0]})
        // grabbing Ganache network ID 5777
        const networkId = await web3.eth.net.getId()

        // Load Tether tokens
        // storing access to Tether abi file info
        const tetherData = Tether.networks[networkId]
        if(tetherData) {
           // storing ability to interact with Tether contract via Tether.abi 
           const tether = new web3.eth.Contract(Tether.abi, tetherData.address)
           // I think I'm setting my tether state to the tether variable declared above
           this.setState({tether})
           // This appears to be accessing 'totalSupply' in the constructor in Tether.sol
           let tetherBalance = await tether.methods.balanceOf(this.state.account).call()
           this.setState({tetherBalance: tetherBalance.toString()})
        } else {
            window.alert('Error! Tether contract not deployed - no detected network')
        }
        
        // Load RWD Contract
        const rwdData = RWD.networks[networkId]
        if(rwdData) {
           const rwd = new web3.eth.Contract(RWD.abi, rwdData.address)
           this.setState({rwd})
           let rwdBalance = await rwd.methods.balanceOf(this.state.account).call()
           this.setState({rwdBalance: rwdBalance.toString()})
           console.log(rwdBalance)
        } else {
            window.alert('Error! Reward token contract not deployed - no detected network')
        }
        
        // Load DecentralBank Contract
        const decentralBankData = DecentralBank.networks[networkId]
        if(decentralBankData) {
           const decentralBank = new web3.eth.Contract(DecentralBank.abi, decentralBankData.address)
           this.setState({decentralBank})
           let stakingBalance = await decentralBank.methods.stakingBalance(this.state.account).call()
           this.setState({stakingBalance: stakingBalance.toString()})
        } else {
            window.alert('Error! Decentral Bank contract not deployed - no detected network')
        }
        this.setState({loading: false})
    }

    // staking function
    stakeTokens = (amount) => {
        this.setState({loading: true})
        this.state.tether.methods.approve(this.state.decentralBank._address, amount).send({from: this.state.account}).on('transactionHash', (hash) => {
        this.state.decentralBank.methods.depositTokens(amount).send({from: this.state.account}).on('transactionHash', (hash) => {
            this.setState({loading: false})
        })
    })
    }

    unstakeTokens = () => {
        this.setState({loading: true})
        this.state.decentralBank.methods.unstakeTokens().send({from: this.state.account}).on('transactionHash', (hash) => {
            this.setState({loading: false})
        })
    }

    constructor(props) {
        super(props)
        this.state = {
            account: '0x0',
            tether: {},
            rwd: {},
            decentralBank: {},
            tetherBalance: '0',
            rwdBalance: '0',
            stakingBalance: '0',
            loading: true
        }
    }

    render() {
        let content
        {this.state.loading ? content = 
        <p id='loader' className='text-center' style={{margin:'30px', color: 'white'}}>
        LOADING PLEASE...</p> : content = 
        <Main 
        tetherBalance={this.state.tetherBalance}
        rwdBalance={this.state.rwdBalance}
        stakingBalance={this.state.stakingBalance}
        stakeTokens={this.stakeTokens}
        unstakeTokens={this.unstakeTokens}
        />}
        return (
            <div className='App' style={{position: 'relative'}}>
                <div style={{position: 'absolute'}}>
                    <ParticleSettings />
                </div>
                <Navbar account={this.state.account}/>
                <div className='container-fluid mt-5'>
                    <div className='row'>
                        <main role='main' className='col-lg-12 ml-auto mr-auto' style={{maxWidth: '600px', minHeight: '100vm'}}>
                            <div>
                                {content}
                                {console.log(this.state.loading)}
                            </div>
                        </main>
                    </div>
                </div>
            </div>
        )
    }
}

export default App;