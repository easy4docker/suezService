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

        pdf.create('doc', options).toFile('fnPDF', (err, res) => {
          me.res.send('8899');
         // me.afterProcessFile((!err)? true : false);
        });
      } catch (e) {
        me.res.send('8891');
      }
      
    }

    processFile() {
      const me = this;
      console.log('processFile - ' + me.cfile);
      const fnPDF = me.dataFolder + '/output/' + me.cfile + '.pdf';
      fs.readFile(me.dataFolder + '/input/' + me.cfile, 'utf-8', (err, doc)=> {
        try {
          const options = { format: 'A4', 
          'border': {
            'top': '0.5in',            // default is 0, units: mm, cm, in, px
            'right': '0.5in',
            'bottom': '0.5in',
            'left': '0.5in'
          }};

          pdf.create(doc, options).toFile(fnPDF, (err, res) => {
            me.afterProcessFile((!err)? true : false);
          });
        } catch (err) {
         console.log(err.message + '=--->>>' + doc);
         me.afterProcessFile(false);
        }
      });
    }
    afterProcessFile(success) {
      const me = this;
      const targetFolder = (success) ? '/done/' : '/failed/';
      fs.rename(me.dataFolder + '/input/' + me.cfile, me.dataFolder +  targetFolder + me.cfile, 
        (err)=> {
          console.log('Successfully renamed - ' + me.cfile);
          me.cfile = '';
        });
    }
}