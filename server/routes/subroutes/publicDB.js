var express = require('express');
var router = express.Router();

var Web3 = require('web3');
var provider = new Web3.providers.HttpProvider("https://wevote.blockchain.azure.com:3200/Zr6vQionvLVeneyF9fIkQZwA");
var web3 = new Web3(provider);
var publicDBContract = require("../../../src/contractsJSON/publicDB");
/* GET API. */
router.get('/:contractAddress', function (req, res, next) {
  var db = new web3.eth.Contract(publicDBContract.abi, req.params.contractAddress);
  var authorisation = {};
  var reports = {};
  var details = {};
  var voters = [];
  var owner = '';
  db.methods
    .voterCount()
    .call()
    .then(result => {
      for (var i = 0; i < result; i++) {
        db.methods
          .voters(i)
          .call()
          .then(voter => {
            voters.push(voter);
            db.methods
              .authorisation(voter)
              .call()
              .then(result => {
                authorisation[voter] = result;
              });
            db.methods
              .reports(voter)
              .call()
              .then(result => {
                reports[voter] = parseInt(result);
              });
            db.methods
              .details(voter)
              .call()
              .then(result => {
                details[voter] = result;
              });
          });
      }
    });
  db.methods
    .owner()
    .call()
    .then(result => {
      owner = result;
    });
  setTimeout(() => {
    res.json({
      authorised: authorisation,
      reports: reports,
      voters: voters,
      owner: owner,
      details: details
    });
  }, 5000);
});

module.exports = router;
