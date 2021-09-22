var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  delete require.cache[req.app.get('appModulesFolder') +'/qrPDFModule.js'];
  const QRPDF  = require(req.app.get('appModulesFolder') +'/qrPDFModule.js');
  const qrpdf = new QRPDF(req, res, next);
  qrpdf.sendPDF();
});

module.exports = router;
