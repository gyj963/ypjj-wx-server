const http = require('http');

const hostname = 'localhost';
const port = 80;

const server = http.createServer((req, res) => {
	let body = [];
	req.on('error',(err) => {
		console.error(err);
	}).on('data', chunk => {
		console.log('chunk:',chunk)
		body.push(chunk);


	}).on('end', () => {
		if(req.url === '/wx'){	
			body = Buffer.concat(body).toString();
			console.log("req body:",body);
			res.statusCode = 200
    			res.setHeader('Content-Type', 'text/plain');
    			res.end('Hello world\n');
		}
	})
		
})

server.listen(port, () => {
    console.log(`Server runnint at ${port}`);
})
