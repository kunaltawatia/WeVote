var express = require('express');
var router = express.Router();

var publicDBSubrouter = require('./subroutes/publicDB');
/* GET API. */
router.get('/', function(req, res, next) {
  res.send('WEVOTE API');
});

router.use('/publicDB', publicDBSubrouter);

module.exports = router;
