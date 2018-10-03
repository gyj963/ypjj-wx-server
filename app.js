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

router.post('/wx', async (ctx, next) => {
	if(ctx.wx.hashcode != ctx.wx.signature){
		ctx.status = 500;
		ctx.body = 'failed';
		return false;
	}
	// let resObj = `<xml><ToUserName><![CDATA[??????]]></ToUserName>
	// 		<FromUserName><![CDATA[!!!!!!!!!!!]]></FromUserName>
	// 		<CreateTime>12345678</CreateTime>
	// 		<MsgType><![CDATA[text]]></MsgType>
	// 		<Content><![CDATA[你好]]></Content>
	// 		</xml>`;
	// 	ctx.status = 200;
	// 	ctx.type = 'application/xml';
	// 	ctx.body = resObj;
	// 	console.log("???????ctx:",ctx);
	function getXmlObj(ctx){
		return new Promise((resolve, reject) => {
			let body = [];
			ctx.req.on('data', chunk => {
				body.push(chunk);
			}).on('end', () => {
				let xml = Buffer.concat(body).toString();
				let parseString = promisify(xml2js.parseString, xml2js);
				parseString(xml).then((result) => {
					let receiveData = result.xml;
					resolve(receiveData);
				}).catch((err)=>{
					reject(err);
				})
			})
		})
	}
	let xmlObj = await getXmlObj(ctx);
	
	if(xmlObj) {
		let resObj = `<xml><ToUserName><![CDATA[${xmlObj.FromUserName}]]></ToUserName>
			<FromUserName><![CDATA[${xmlObj.ToUserName}]]></FromUserName>
			<CreateTime>12345678</CreateTime>
			<MsgType><![CDATA[text]]></MsgType>
			<Content><![CDATA[你好]]></Content>
			</xml>`;
		ctx.status = 200;
		ctx.type = 'application/xml';
		ctx.body = resObj;
		console.log("???????ctx:",ctx);
	} else {
		ctx.status = 200;
		ctx.body = 'success';
		console.log("!!!!!!!!ctx:",ctx);
	}
})

app.use(wx)
app.use(router.routes());
// app.use(router.allowedMethods());

app.listen(port, () => {
    console.log(`Server runnint at ${port}`);
})
