pragma solidity ^0.5.0;
import './RWD.sol';
import './Tether.sol';

contract DecentralBank {
    string public name = 'Decentral Bank';
    address public owner;
    Tether public tether;
    RWD public rwd;

    // An array of people who have staked with this bank
    address[] public stakers;

    // Key-value stores for the balance of a user's stake, and for keeping track of who has staked and is staked
    mapping(address => uint) public stakingBalance;
    mapping(address => bool) public hasStaked;
    mapping(address => bool) public isStaked;

    constructor(RWD _rwd, Tether _tether) public {
        rwd = _rwd;
        tether = _tether;
    }

    // staking function
    function depositTokens(uint _amount) public {
        // Transfer Tether tokens to this contract address for staking
        tether.transferFrom(msg.sender, address(this), _amount);

        // Update Staking Balance
        stakingBalance[msg.sender] = stakingBalance[msg.sender] + _amount;
        if(!hasStaked) {
            stakers.push[msg.sender];
        }

        isStaking[msg.sender] = true;
        hasStaked[msg.sender] = true;

    }
}