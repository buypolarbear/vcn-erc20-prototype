const VentureCoinCrowdsale = artifacts.require("./VentureCoinCrowdsale.sol")
const Web3 = require('web3');
var localWeb3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));

module.exports = function(deployer, network, accounts) {
  const startTime =  latestTime() + duration.minutes(480); // + 8 hrs
  const endTime = startTime + duration.days(60); // + 60 days
  const rate = 8000;
  const wallet = accounts[0];
  const cappedInWei = web3.toWei(41625, "ether");

  // deploy it here
  deployer.deploy(VentureCoinCrowdsale, startTime, endTime, rate, wallet, cappedInWei)
    .then( async () => {
      const instance = await VentureCoinCrowdsale.deployed();
      const token = await instance.token.call();
      console.log('-----> Token Address', token);
      
      console.log('-----> startTime:  ', startTime);
      console.log('-----> endTime:    ', endTime);
      console.log('-----> rate:       ', rate.toString());
      console.log('-----> wallet:     ', wallet);
      console.log('-----> cappedInWei:', cappedInWei);

      var encoded = localWeb3.eth.abi.encodeParameters(
          ['uint256', 'uint256', 'uint256', 'address', 'uint256'], 
          [startTime, endTime, rate.toString(), wallet, cappedInWei]
      )

      console.log('-----> ABIencoded:');
      console.log(encoded);

    })
};

function latestTime() {
  return web3.eth.getBlock('latest').timestamp;
}

const duration = {
  seconds: function(val) { return val },
  minutes: function(val) { return val * this.seconds(60) },
  hours:   function(val) { return val * this.minutes(60) },
  days:    function(val) { return val * this.hours(24) },
  weeks:   function(val) { return val * this.days(7) },
  years:   function(val) { return val * this.days(365)} 
};
