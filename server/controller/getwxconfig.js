const fs = require('fs');
let generateRandomString = () => {
    let string = Math.random().toString(36).replace(/[^a-z]+/g, '')
    return string;
}
let getwxconfig = ctx => {
    let data = fs.readFileSync(`./server/wxcache.json`,'utf8');
    let paramObj = {
        'jsapi_ticket': data.jsapiTicket.value,
        'noncestr': `${generateRandomString()}${generateRandomString()}${generateRandomString()}`, 
        'timestamp': new Date().getTime(),
        'url': ctx.query.url,
    }
    let paramArray = ['jsapi_ticket', 'noncestr', 'timestamp', 'url'];
    paramArray = paramArray.sort().map((param) => {
        return `${param}=${paramObj[param]}`;
    })
    let paramStr = paramArray.join('&');
    let hash = crypto.createHash('sha1');
    hash.update(paramStr);
    paramObj.signature = hash.digest('hex');
    ctx.type = 'application/json';
    ctx.body = paramObj;
}
module.exports = getwxconfig;