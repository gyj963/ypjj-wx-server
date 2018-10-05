const mongoose = require('mongoose');
let db = mongoose.connect('mongodb://172.16.109.196/wechat');
module.exports = async (ctx, next) => {
    console.log("db:",db);
    // ctx.db = mongoose.connection;
    db.then((data)=>{
        console.log("db data:",data);
    }).catch((err) => {
        console.log("db err:",err);
    })
    await next();
};