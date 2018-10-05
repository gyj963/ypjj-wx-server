const mongoose = require('mongoose');
let db = mongoose.connect('mongodb://172.16.109.196/wechat');

module.exports = async (ctx, next) => {
    ctx.db = db;
    await next()
};