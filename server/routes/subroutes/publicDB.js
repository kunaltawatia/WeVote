var express = require('express');
var router = express.Router();

var Web3 = require('web3'); 
var provider = new Web3.providers.HttpProvider("https://wevote.blockchain.azure.com:3200/Zr6vQionvLVeneyF9fIkQZwA");
var web3 = new Web3(provider);

/* GET API. */
router.get('/:id', function(req, res, next) {
  res.send('PUBLIC DB');
});

module.exports = router;
