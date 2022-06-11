const GBERC20 = artifacts.require("GBERC20");

module.exports = function (deployer) {
  deployer.deploy(GBERC20, ['100000000000000000000000']);
};
