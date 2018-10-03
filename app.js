const http = require('http');
const url = require('url');
const crypto = require('crypto');
const xml2js = require('xml2js');
const Koa = require('koa');
const Router = require('koa-router');
const wx = require('./server/middleware/wx')
const hostname = 'localhost';
const port = 80;
// const port = 3000;

var app = new Koa();
var router = new Router();

let promisify = (fn, receiver) => {
	return (...args) => {
		return new Promise((resolve, reject) => {
			fn.apply(receiver, [...args, (err, res) => {
				return err ? reject(err) : resolve(res);
			}])
		})
	}
}

router.get('/wx', ctx => {
	if(ctx.wx.hashcode == ctx.wx.signature){
		ctx.status = 200;
		ctx.body = ctx.wx.echostr;
	}else{
		ctx.status = 500;
		ctx.body = 'failed'
	}
})

router.post('/wx', ctx => {
	if(ctx.wx.hashcode != ctx.wx.signature){
		ctx.body = 'failed';
		return false;
	}
	let xml = Buffer.concat(ctx.body).toString();
	let parseString = promisify(xml2js.parseString, xml2js);
	parseString(xml).then((result) => {
		let receiveData = result.xml;
		let resObj = `<xml>
			<ToUserName><![CDATA[${receiveData.FromUserName}]]></ToUserName>
			<FromUserName><![CDATA[${receiveData.ToUserName}]]></FromUserName>
			<CreateTime>12345678</CreateTime>
			<MsgType><![CDATA[text]]></MsgType>
			<Content><![CDATA[你好]]></Content>
			</xml>`;
		ctx.status = 200;
		ctx.set('Content-Type', 'application/xml')
		ctx.body = resObj;
	}).catch((err)=>{
		ctx.status = 200;
		ctx.body = 'success';
	})
})

app.use(wx)
app.use(router.routes());
app.use(router.allowedMethods());

app.listen(port, () => {
    console.log(`Server runnint at ${port}`);
})
