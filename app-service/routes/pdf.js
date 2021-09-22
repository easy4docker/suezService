var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send(__dirname + '_pdf--' + req.app.get('appModulesFolder'));
});

module.exports = router;
