const request = require('superagent')
const config = require('../../config/default')
const fs = require('fs');

let updatewxcache = ctx => {
    ctx.status = 200;
    // const db = ctx.db;
    // const Schema = db.Schema;
    // const WxCacheSchema = new Schema({
    //     key: String,
    //     value: String,
    //     expires: Date
    // });
    // let wxCache = db.model('wxCache', WxCacheSchema);
    let curTimestamp = new Date().getTime();
    getAccesstoken()
    .end((err, res) => {
        let accessTokenObj = res.body;
        // let accessTokenCache = new wxCache({
        //     key: 'access_token',
        //     value: accessTokenObj.access_token,
        //     expires: curTimestamp+accessTokenObj.expires_in, // 过期时间时间戳
        // });
        // accessTokenCache.save((err)=>{
        //     if(err){
        //         console.log("accessTokenCache.save err:",err);
        //     }
        // })
        getTicket(accessTokenObj.access_token)
        .end((err, res) => {
            let ticketObj = res.body;
            // let jsapiTicketCache = new wxCache({
            //     key: 'jsapi_ticket',
            //     value: ticketObj.ticket,
            //     expires: curTimestamp+ticketObj.expires_in,
            // });
            // jsapiTicketCache.save((err)=>{
            //     if(err){
            //         console.log("JsapiTicket.save err:",err);
            //     }
            // })
            let wxcachejson = {
                curTimestamp,
                accessToken: {
                    value: accessTokenObj.access_token,
                    expires: curTimestamp+accessTokenObj.expires_in, // 过期时间时间戳
                },
                jsapiTicket: {
                    value: ticketObj.ticket,
                    expires: curTimestamp+ticketObj.expires_in,
                }
            }
            fs.writeFileSync(`./server/wxcache.json`, JSON.stringify(wxcachejson));
        })
    })
}

let getAccesstoken = () => {
    let getAccesstokenUrl = 'https://api.weixin.qq.com/cgi-bin/token';
    let queryObj = {
        grant_type: 'client_credential',
        appid: config.appid,
        secret: config.appsecret,
    }
    return request
    .get(getAccesstokenUrl)
    .query(queryObj)
}
let getTicket = (access_token) => {
    let getTicketUrl = 'https://api.weixin.qq.com/cgi-bin/ticket/getticket';
    let queryObj = {
        access_token,
        type: 'jsapi',
    }
    return request
    .get(getTicketUrl)
    .query(queryObj)
}

module.exports = updatewxcache;