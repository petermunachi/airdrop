
const Token = artifacts.require("./Token.sol");
const TokenSale = artifacts.require("./TokenSale.sol");

module.exports = function (deployer) {
  deployer.deploy(Token).then(function () {
    // Token price is 0.1 BNB
    var tokenPrice = 100000000000000000; 

    return deployer.deploy(TokenSale, Token.address);
  })
};
