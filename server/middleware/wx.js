const crypto = require('crypto');

function Wx(ctx, next) {
    console.log("Wx ctx:",ctx);
    let paramsMap = ctx.query;
    let { signature, timestamp, nonce, echostr } = paramsMap;
    let token = 'helloypjj';
    let str = [ token, timestamp, nonce ].sort().join('');
    let hash = crypto.createHash('sha1');
    hash.update(str);
    let hashcode = hash.digest('hex');
    ctx.wx = {
        signature,
        echostr,
        hashcode,
    }
    next();
}

module.exports = Wx;
