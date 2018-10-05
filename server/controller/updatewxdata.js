let updatewxdata = ctx => {
    const mongoose = ctx.mongoose;
    const Schema = mongoose.Schema;
    const WxCacheSchema = new Schema({
        value: String,
        expires: Date
    });
    let AccessToken = mongoose.model('accessToken', WxCacheSchema);
    let JsapiTicket = mongoose.model('jsapiTicket', WxCacheSchema);

    let url_getaccesstoken = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=&secret=`
    fetch()

}

module.exports = updatewxdata;