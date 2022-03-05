import React, {Component} from 'react';
import './App.css'
import Navbar from './Navbar';
import Web3 from 'web3';

class App extends Component {

    async UNSAFE_componentWillMount() {
        await this.loadWeb3()
        await this.loadBlockChainData()
    }

    // this connects our app to the blockchain
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
    }
    
    constructor(props) {
        super(props)
        this.state = {
            account: '0x0'
        }
    }

    render() {
        return (
            <div>
                <Navbar account={this.state.account}/>
            </div>
        )
    }
}

export default App;