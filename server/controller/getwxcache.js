const fs = require('fs');

let getwxcache = ctx => {
    // const db = ctx.db;
    // let wxCache = db.model('wxCache');
    // wxCache.findOne({key:'jsapi_ticket'}, 'value')
    // .exec((err, value) => {
    //     ctx.body = `jsapi_ticket: ${value}`
    //     console.log("wxCache jsapi_ticket value:",value);
    //     let wxObj = ctx.wx || {};
    //     wxObj.jsapiTicket = value;
    //     ctx.wx = wxObj;
    // })
    let data = fs.readFileSync(`./server/wxcache.json`,'utf8');
    ctx.body = data;
}
module.exports = getwxcache;