const Poll = artifacts.require("authenticatedPoll");

module.exports = function(deployer) {
  deployer.deploy(Poll,"How are you?_=_Fine_=_Not Fine",2,'0xE943de74b07795e4e8bf6436E93D219055dE6ecA');
};
