const mongoose = require('mongoose');
mongoose.connect('mongodb://172.16.109.196/wechat').then((data)=>{
    console.log("mongooseConnect data:", data);
}, (err) => {
    console.log("mongooseConnect err:", err);
});

module.exports = async (ctx, next) => {
    ctx.db = mongoose;
    await next()
};