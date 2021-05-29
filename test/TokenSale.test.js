import { tokens, ether, ETHER_ADDRESS } from './helpers'

const TokenSale = artifacts.require("./TokenSale");
const Token = artifacts.require('./Token');


require('chai')
  .use(require('chai-as-promised'))
  .should()

contract("TokenSale", ([deployer, user1, user2, referral]) => {
  let token
  let tokenSale
  let tokenSaleAddress;
  let walletAddress = '0xC2a86328A0EF569602D94f7C52F0a6f8Bb6F3F17';
  let tokenAmount = tokens(250).toString();
  let airdropAmount = tokens(20).toString();
  let tokenPrice = ether(0.1).toString();
  let totalSupply  = 100000000000000000000000000;

  console.log("am token", (tokenAmount * ether(1)) / tokenPrice);

  beforeEach(async () => {
    // Deploy token
    token = await Token.new();

    // Deploy exchange
    tokenSale = await TokenSale.new(token.address);

    tokenSaleAddress = tokenSale.address;

    await token.transfer(tokenSale.address, tokens(100000000), { from: deployer });

    console.log("Total supply", tokens(100000000).toString());


  })


  // describe('deployment', () => {
  //   it('check withdrawal address', async () => {
  //     let result = await tokenSale.walletAddress();
  //     // console.log(result);
  //     result.should.equal(walletAddress)
  //   })

  //   it('check tokenAmount ', async () => {
  //     let result = await tokenSale.tokenAmount();
  //     // console.log(result);
  //     result.toString().should.equal(tokenAmount)
  //   })

  //   it('check tokenPrice ', async () => {
  //     let result = await tokenSale.tokenPrice();
  //     // console.log(result);
  //     result.toString().should.equal(tokenPrice)
  //   })

  //   it('check airdropAmount ', async () => {
  //     let result = await tokenSale.airdropAmount();
  //     // console.log(result);
  //     result.toString().should.equal(airdropAmount)
  //   })

    
  // })

  // describe('airdrop', () => {

  //   let result;

  //   beforeEach(async () => {
  //     // Transfer all tokens to TokenSale contract
  //     result = await tokenSale.getAirdrop({from: user1});
  //   })

  //   it('tracks the airdrops', async () => {
  //     let balanceOf;
  //     balanceOf = await token.balanceOf(tokenSaleAddress);
  //     balanceOf.toString().should.equal(tokens(99999980).toString());
      
  //     // check if airdrops is received
  //     balanceOf = await token.balanceOf(user1);
  //     balanceOf.toString().should.equal(tokens(20).toString());
  //   })   

  //   it('tracks the airdrop Wallet', async () => {
  //     let airdropWallets = await tokenSale.airdropWallets(user1);
  //     airdropWallets.should.equal(true)
  //   })   

  //   it('emits a "Airdrops" event', () => {
  //     const log = result.logs[0];
  //     log.event.should.eq('Airdrops');
  //     const event = log.args;
  //     event.reciever.should.equal(user1, 'deployer address is correct');
  //     event.amount.toString().should.equal(airdropAmount, 'amount is correct');
  //   })

  // })

  
  describe('depositing BNB', async() => {
    let result;
    let amount = ether(1)
    let tokenAmount = Math.floor((250 * 0.1) / 0.1);
    let referralAmount = Math.floor(0.25 * tokenAmount);
    
    console.log("tokenAmount sent", tokenAmount);
    console.log("referralAmount sent", referralAmount);

    beforeEach(async() => {
      // Deposit BNB
      result = await tokenSale.depositBNB(tokenAmount, referralAmount, ETHER_ADDRESS, { from: deployer, value: amount })
    })
    
    it('check if BNB is received', async () => {
      let balance = await web3.eth.getBalance(walletAddress);
      console.log("am a balance", balance);
      balance.toString().should.equal(tokens(102).toString());
    })
      
    it('tracks depositing BNB', async () => {
      let balanceOf;
      balanceOf = await token.balanceOf(tokenSaleAddress);
      balanceOf.toString().should.equal(tokens(99999688).toString());
      
      // check if airdrops is received
      balanceOf = await token.balanceOf(deployer);
      balanceOf.toString().should.equal(tokens(250).toString());

      balanceOf = await token.balanceOf(referral);
      balanceOf.toString().should.equal(tokens(62).toString());
      
      balanceOf = await tokenSale.referrals(referral);
      balanceOf.toString().should.equal(tokens(62).toString());

    })

    it('tracks referral', async () => {
      let balanceOf;
      balanceOf = await token.balanceOf(referral);
      balanceOf.toString().should.equal(tokens(62).toString());
      
      balanceOf = await tokenSale.referrals(referral);
      balanceOf.toString().should.equal(tokens(62).toString());

    })
  
    it('emits a "Deposit" event', () => {
      const log = result.logs[0]
      log.event.should.eq('Deposit')
      const event = log.args
      event.sender.should.equal(deployer)
      event.amount.toString().should.equal(amount.toString())
      event.balance.toString().should.equal('0')
    })
  
  })

  // describe('change address', () => {
  //   let addr = '0xD48E56d4cb018aC2F72b9B66576D69B8df3e601d';
  //   let result;
  //   beforeEach(async () => {
  //     result = await tokenSale.createAdd(addr, { from: deployer});
  //   })

  //   it('emits a "NewAddr" event', () => {
  //     const log = result.logs[0]
  //     log.event.should.eq('NewAddr')
  //     const event = log.args
  //     event.addr.toString().should.equal(addr)
  //   })
    
  // })

  // describe('get balance', () => {
  //   it('tracks balance in a contract', async () => {
  //     let balanceOf;
  //     balanceOf = await tokenSale.getBalance({ from: deployer})
  //     balanceOf.toString().should.equal('0');

  //   })
  // })
  


});
