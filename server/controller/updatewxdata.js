const request = require('superagent')
const config = require('../../config/default')

let updatewxdata = async (ctx, next) => {
    // const db = ctx.db;
    // const Schema = db.Schema;
    // const WxCacheSchema = new Schema({
    //     value: String,
    //     expires: Date
    // });
    // let AccessToken = db.model('accessToken', WxCacheSchema);
    // let JsapiTicket = db.model('jsapiTicket', WxCacheSchema);
    
    let getAccesstoken = `https://api.weixin.qq.com/cgi-bin/token`;
    let queryObj = {
        grant_type: 'client_credential',
        appid: config.appid,
        secret: config.appsecret,
    }
    await next();
    request
    .get(getAccesstoken)
    .query(queryObj)
    .end((err, res) => {
        ctx.body = res.body;
        console.log("res:",res.body);
    })
}

module.exports = updatewxdata;