var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  delete require.cache[req.app.get('appModulesFolder') +'/pdf.js'];
  const PDF  = require(req.app.get('appModulesFolder') +'/pdf.js');
  const pdf = new PDF();
  res.send(pdf.sendPDF());
});

module.exports = router;
