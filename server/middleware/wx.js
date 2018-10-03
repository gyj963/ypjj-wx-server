const crypto = require('crypto');

function Wx() {
    let paramsMap = this.ctx.query;
    let { signature, timestamp, nonce, echostr } = paramsMap;
    let token = 'helloypjj';
    let str = [ token, timestamp, nonce ].sort().join('');
    let hash = crypto.createHash('sha1');
    hash.update(str);
    let hashcode = hash.digest('hex');
    this.ctx.wx = {
        signature,
        echostr,
        hashcode,
    }
}

module.exports = Wx;
