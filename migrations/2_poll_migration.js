const Poll = artifacts.require("poll");

module.exports = function(deployer) {
  deployer.deploy(Poll,"How are you?_=_Fine_=_Not Fine",2);
};
