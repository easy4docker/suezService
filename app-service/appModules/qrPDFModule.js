const fs = require('fs'), path = require('path');
const pdf = require('html-pdf');
const QRCode = require('qrcode');
module.exports = class QRPDF  {
  constructor(req, res, next) {
    this.cfile = '';
    this.req = req;
    this.res = res;
    
  }
  tpl = (str, vars) =>{
    var func = new Function(...Object.keys(vars),  "return `"+ str +"`;");
    let html = '';
    try {
      html =func(...Object.values(vars));
    } catch (et) {
      html = et.message;
    }
    return  html;
  }
  readTemplate(callback) {
    const me = this;
    const tplFn = (this.req.body) ? '' : this.req.body.template;
    fs.readFile(me.req.app.get('tplsFolder') + '/pdfs/' + tplFn, 'utf-8', (err, data)=> {
        callback((err) ? err.message : data);
    });
  }
  qr(callback) {
    const me = this;
    const qrLink = (this.req.body || !this.req.body.data) ? '' : this.req.body.data.qrLink;
    if (qrLink) {
      QRCode.toDataURL(qrLink, { 
        width:256,
        type: 'image/png',
        quality: 1.0,
        color: {
            dark: '#000000',  
            light: '#0000'
        }
      }, (err, str)=>{
        callback(str);
      });
    } else {
      callback('');
    }
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
      me.readTemplate((tplhtml)=> {
          me.qr((base64Str)=> {
            const bodyData = (!me.req.body || !me.req.body.data) ? {} : me.req.body.data;
            let html = me.tpl(tplhtml,bodyData);
            pdf.create(html, options, function(err, buffer){
              me.res.sendFile(buffer.filename, ()=> {
                fs.unlink(buffer.filename, ()=> {});
                });
            });
          })
        }
      );
    } catch (e) {
      me.res.send({status:'failure', message : e.message});
    }
  }
}