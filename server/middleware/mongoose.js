const mongoose = require('mongoose');
mongoose.connect('mongodb://172.16.109.196/wechat');

module.exports = async (ctx, next) => {
    ctx.db = mongoose;
    await next()
};