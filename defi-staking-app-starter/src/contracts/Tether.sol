pragma solidity ^0.5.0;

contract Tether {
    string public name = 'Mock Tether Token';
    string public symbol = 'mUSDT';
    uint256 public totalSupply = 1000000000000000000; // ETH has 18 decimals
    uint8 public decimals = 18;
}