pragma solidity ^0.5.0;
import './RWD.sol';
import './Tether.sol';

// DecentralBank is a contract pertaining to the movement of money in and out of the bank
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
    mapping(address => bool) public isStaking;

    constructor(RWD _rwd, Tether _tether) public {
        rwd = _rwd;
        tether = _tether;
        owner = msg.sender;
    }

    // staking function
    function depositTokens(uint _amount) public {
        // require staking amount to be greater than zero
        require(_amount > 0, 'amount cannot be zero');

        // Transfer Tether tokens to this contract address for staking
        tether.transferFrom(msg.sender, address(this), _amount);

        // Update Staking Balance
        stakingBalance[msg.sender] = stakingBalance[msg.sender] + _amount;
        if(!hasStaked[msg.sender]) {
            stakers.push(msg.sender);
        }

        isStaking[msg.sender] = true;
        hasStaked[msg.sender] = true;
    }

    // unstake tokens
    function unstakeTokens() public {
        uint balance = stakingBalance[msg.sender];
        require(balance > 0, 'staking balance cannot be less than zero');
        // transfer the tokens to the specified contract address from our bank
        tether.transfer(msg.sender, balance);
        // reset staking balance
        stakingBalance[msg.sender] = 0;
        // update staking status
        isStaking[msg.sender] = false;
    }

    // issue rewards
    function issueTokens() public {
        // require the owner to issue tokens only
        require(msg.sender == owner, 'caller must be the owner');
        for (uint i=0; i<stakers.length; i++) {
            address recipient = stakers[i];
            uint balance = stakingBalance[recipient] / 9; // divide by 9 to incentivize more staking
            if(balance > 0) {
            rwd.transfer(recipient, balance);
            }
        }
    }
}