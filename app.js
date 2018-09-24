const http = require('http');
const url = require('url');
const crypto = require('crypto');
const xml2js = require('xml2js');
const hostname = 'localhost';
const port = 80;

let promisify = (fn, receiver) => {
	return (...args) => {
		return new Promise((resolve, reject) => {
			fn.apply(receiver, [...args, (err, res) => {
				return err ? reject(err) : resolve(res);
			}])
		})
	}
}
const server = http.createServer((req, res) => {
	let body = [];
	req.on('data', chunk => {
		body.push(chunk);
		

	}).on('end', () => {
		if(req.url.includes('/wx')){
//			if(req.method == 'get'){
// 			let urlObj = url.parse(req.url);
// 			console.log("urlObj:",urlObj);
// 			let params = new url.URLSearchParams(urlObj.query);
// 			let paramsMap = {};
// 			for (const [name, value] of params){
// 				paramsMap[name] = value;
// 			}
// 			let { signature, timestamp, nonce, echostr } = paramsMap;
// 			let token = 'helloypjj';
// 			let str = [ token, timestamp, nonce ].sort().join('');
// 			let hash = crypto.createHash('sha1');
// 			hash.update(str);
// 			let hashcode = hash.digest('hex');
// 			if(hashcode == signature){
// 				res.statusCode = 200;
// 				res.end(echostr);
// 			}else{
// 				res.statusCode = 500;
// 				res.end('');
// 			}
//			}
			let xml = Buffer.concat(body).toString();
			console.log("xml:",xml);
			let parseString = promisify(xml2js.parseString, xml2js);
			let receiveData = {};
			parseString(xml).then((result) => {
				let receiveData = result.xml;
				let resObj = `<xml>
					<ToUserName><![CDATA[${receiveData.FromUserName}]]></ToUserName>
					<FromUserName><![CDATA[${receiveData.ToUserName}]]></FromUserName>
					<CreateTime>12345678</CreateTime>
					<MsgType><![CDATA[text]]></MsgType>
					<Content><![CDATA[你好]]></Content>
					</xml>`;
//				console.log("result:",result);
//				let resObj = {
//					ToUserName: receiveData.FromUserName,
//					FromUserName: receiveData.ToUserName,
//					CreateTime: new Date().getTime(),
//					Content: 'test',
//					MsgType: receiveData.MsgType
//				}
//				let builder = new xml2js.Builder();
//				let resXml = builder.buildObject(resObj);
				//res.statusCode = 200;
				res.writeHead(200, {'Content-Type': 'application/xml'});
				//console.log("res.header????:",res.headers);
				//res.setHeader('Content-Type', 'text/xml');
				//console.log("???????res:",res);
				//res.end(resXml);
				console.log(":::::::resObj:",resObj);
				res.end(resObj);
				
  			}).catch((err)=>{
  				res.statusCode = 200;
  				res.end('success');
  			})
//			res.statusCode = 200;
//			res.end('success');
		}
	})
		
})

server.listen(port, () => {
    console.log(`Server runnint at ${port}`);
})
