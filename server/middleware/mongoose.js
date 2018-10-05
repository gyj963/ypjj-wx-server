const mongoose = require('mongoose');
let mongooseConnect = mongoose.connect('mongodb://172.16.109.196/wechat');
mongooseConnect.on('error', err => {
    console.log("mongooseConnect err:", err);
})
module.exports = async (ctx, next) => {
    ctx.db = mongoose;
    await next()
};