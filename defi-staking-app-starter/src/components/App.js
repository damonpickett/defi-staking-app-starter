import React, {Component} from 'react';
import './App.css'
import Navbar from './Navbar';
import Web3 from 'web3';
import Tether from '../truffle_abis/Tether.json';
import RWD from '../truffle_abis/RWD.json';
import DecentralBank from '../truffle_abis/DecentralBank.json';
import Main from './Main'


class App extends Component {

    // We want to connect to wallet before the component mounts
    async UNSAFE_componentWillMount() {
        await this.loadWeb3()
        await this.loadBlockchainData()
    }

    // this function connects app to meta mask
    async loadWeb3() {
        if(window.ethereum) {
            window.web3 = new Web3(window.ethereum)
            await window.ethereum.enable()
        } else if(window.web3) {
                window.web3 = new Web3(window.web3.currentProvider)
            } else {
                window.alert('No ethereum browser detected. Check out MetaMask.')
            }
        }
    
    async loadBlockchainData() {
        const web3 = window.web3
        const account = await web3.eth.getAccounts()
        console.log(account)
        this.setState({account: account[0]})
        console.log(account)
        const networkId = await web3.eth.net.getId()

        // Load Tether contract
        const tetherData = Tether.networks[networkId]
        if(tetherData) {
           const tether = new web3.eth.Contract(Tether.abi, tetherData.address)
           this.setState({tether})
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
        } else {
            window.alert('Error! Reward token contract not deployed - no detected network')
        }

        // Load DecentralBank Contract
        const decentralBankData = DecentralBank.networks[networkId]
        if(tetherData) {
           const decentralBank = new web3.eth.Contract(DecentralBank.abi, decentralBankData.address)
           this.setState({decentralBank})
           let stakingBalance = await decentralBank.methods.stakingBalance(this.state.account).call()
           this.setState({stakingBalance: stakingBalance.toString()})
        } else {
            window.alert('Error! Decentral Bank contract not deployed - no detected network')
        }
        this.setState({loading: false})
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
        return (
            <div>
                <Navbar account={this.state.account}/>
                <div className='containter-fluid mt-5'>
                    <div className='row'>
                        <main role='main' className='col-lg-12 ml-auto mr-auto' style={{maxWidth: '600px', minHeight: '100vm'}}>
                            <div>
                                <Main />
                            </div>
                        </main>
                    </div>
                </div>
            </div>
        )
    }
}

export default App;