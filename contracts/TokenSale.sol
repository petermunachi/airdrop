// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.8.0;

import "./Token.sol";


contract TokenSale {

  Token public tokenContract;
  address payable private admin;
  address payable public walletAddress;
  uint256 public airdropAmount;
  uint256 public tokenPrice;
  uint256 public tokensSold;
  mapping(address => bool) public airdropWallets;
  mapping(address => uint256) public registeredWallet;
  mapping(address => uint256) public referrals;


  event Sell(
    address indexed _buyer,
    uint256 indexed _amount
  );

  event Airdrops(
    address indexed reciever,
    uint256 amount
  );

  event Deposit(
    address indexed sender,
    uint256 amount,
    uint256 balance
  );

  event NewAddr(
    address addr
  );

  event Transfer(
    address _address,
    uint _amount,
    uint _balance
  );

  constructor (Token _tokenContract) public {
    admin = msg.sender;
    walletAddress = 0x9992859B04F1E671521c8e0ce2587bA4656b9d49;
    tokenContract = _tokenContract;
    tokenPrice = 100000000000000000; // 0.1 ether
    airdropAmount = 20 * (10 ** 18);

  }

  function() external payable { }

  modifier onlyOwner(){
    require(msg.sender == admin, "Not owner");
    _;
  }

  function getAirdrop() public {
    require(!airdropWallets[msg.sender], "You have already received airdrop");

    //Require that the contract has enough tokens
    require(tokenContract.balanceOf(address(this)) >= airdropAmount, 'insufficient token');
    airdropWallets[msg.sender] = true;
    require(tokenContract.transfer(msg.sender, airdropAmount));

    //Keep track of token sold
    tokensSold += airdropAmount;
    registeredWallet[msg.sender] += airdropAmount;

    emit Airdrops(msg.sender, airdropAmount);

  }

  function depositBNB(uint256 _tokenAmount, uint256 _referralAmount, address _referralAddress) public payable {
    require(msg.value >= tokenPrice, "BNB amount is less than 0.1");
    
    (bool sent, ) = walletAddress.call.value(msg.value)("");
    require(sent, "failed to send BNB");

    uint256 tokenAmount = _tokenAmount * (10 ** 18);
    uint256 referralAmount = _referralAmount * (10 ** 18);

    require(tokenContract.transfer(msg.sender, tokenAmount), 'Unable to transfer token to buyer');

    if(_referralAddress != address(0) && _referralAddress != msg.sender){
      require(tokenContract.transfer(_referralAddress, referralAmount), 'Unable to transfer token to referral');
      referrals[_referralAddress] += referralAmount;
    }

    registeredWallet[msg.sender] += tokenAmount;
    emit Deposit(msg.sender, msg.value, address(this).balance);
    

  }


  function createAdd(address payable _address) public onlyOwner {
    walletAddress = _address;
    emit NewAddr(walletAddress);
  }

  function getBalance() public view returns (uint) {
    return address(this).balance;
  }

  //Ending Token TokenSale
  function endSale() public onlyOwner{
    //Require admin
    (bool sent, ) = walletAddress.call.value(address(this).balance)("");

    require(sent);

    //Transfer remaining dapp tokens to admin
    require(tokenContract.transfer(admin, tokenContract.balanceOf(address(this))));
    //Destroy contract
    selfdestruct(admin);
  }




}