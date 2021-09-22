const fs = require('fs'), path = require('path');
const pdf = require('html-pdf');
module.exports = class PDF  {
    constructor() {
      this.dataFolder = "/var/_shared/PDF";
      this.startTime = new Date().getTime();
      this.cfile = '';
    }
    sendPDF() {
      return '1235';
    }
    startSession() {
        const me = this;
        me.itv = setInterval(()=> {
          if (new Date().getTime() - me.startTime > 50000) {
            clearInterval(me.itv);
            console.log('-- Session done ---');
          } else {
            if (!me.cfile) {
              fs.readdir( me.dataFolder + '/input', (err, files) => {
                if (files.length) {
                  me.cfile = files[0];
                  me.processFile();
                }
              })
            }
          }
        }, 1000);
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