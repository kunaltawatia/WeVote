const publicDB = artifacts.require("publicDB");

module.exports = function(deployer) {
  deployer.deploy(publicDB,"OWNER_=_35");
};
