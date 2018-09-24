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
			let urlObj = url.parse(req.url);
			let params = new url.URLSearchParams(urlObj.query);
			let paramsMap = {};
			for (const [name, value] of params){
				paramsMap[name] = value;
			}
			let { signature, timestamp, nonce, echostr } = paramsMap;
			let token = 'helloypjj';
			let str = [ token, timestamp, nonce ].sort().join('');
			let hash = crypto.createHash('sha1');
			hash.update(str);
			let hashcode = hash.digest('hex');
			if(req.method == 'GET'){
				if(hashcode == signature){
					res.statusCode = 200;
					res.end(echostr);
				}else{
					res.statusCode = 500;
					res.end('faild');
				}
			} else if (req.method == 'POST'){
				if(hashcode != signature){
					res.end('faild');
					return false;
				}
				let xml = Buffer.concat(body).toString();
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
					res.writeHead(200, {'Content-Type': 'application/xml'});
					res.end(resObj);
					
				  }).catch((err)=>{
					  res.statusCode = 200;
					  res.end('success');
				  })
			}
		}
	})
		
})

server.listen(port, () => {
    console.log(`Server runnint at ${port}`);
})
