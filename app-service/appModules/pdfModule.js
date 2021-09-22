const fs = require('fs'), path = require('path');
const pdf = require('html-pdf');
module.exports = class PDF  {
  constructor(req, res, next) {
    this.dataFolder = "/var/_shared/PDF";
    this.startTime = new Date().getTime();
    this.cfile = '';
    this.req = req;
    this.res = res; 
  }
  sendPDF() {
    const me = this;
    try {
      const options = { format: 'A4', 
      'border': {
        'top': '0.5in',            // default is 0, units: mm, cm, in, px
        'right': '0.5in',
        'bottom': '0.5in',
        'left': '0.5in'
      }};

      pdf.create('html', options, function(err, buffer){
        me.res.sendFile(buffer.filename);

      });
      /*
      pdf.create('doc', options).toFile('/tmp/fnPDF.pdf', (err, res) => {
        me.res.sendFile(res.filename);
        // me.afterProcessFile((!err)? true : false);
      });*/
    } catch (e) {
      me.res.send('8891');
    }
    
  }
}