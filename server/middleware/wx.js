const crypto = require('crypto');

async function Wx(ctx, next) {
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
    await next();
}

module.exports = Wx;
