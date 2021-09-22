const fs = require('fs'), path = require('path');
const pdf = require('html-pdf');
module.exports = class PDF  {
  constructor(req, res, next) {
    this.cfile = '';
    this.req = req;
    this.res = res; 
  }
  readTemplate(callback) {
    const me = this;
    fs.readFile(me.req.app.get('tplsFolder') + '/pdfs/foodieAuthentication.html', 'utf-8', (err, data)=> {
        callback((err) ? err.message : data);
    });
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
      me.readTemplate(
        (html)=> {
          pdf.create(html, options, function(err, buffer){
            me.res.sendFile(buffer.filename, ()=> {
              fs.unlink(buffer.filename, ()=> {});
              });
          });
        }
      );
    } catch (e) {
      me.res.send({status:'failure', message : e.message});
    }
    
  }
}