const https = require('https');
const fs = require('fs');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const app = require('express')();
const queryString = require('querystring');
const URL = require('url');
// const WebSocket = require('ws');
const socket = require('./service/socket');

const router = require('./routes/router').router;

// var http = require('http');

//获取认证证书
var key = fs.readFileSync('./key/2_www.liudongtushuguan.cn.key');
var cert = fs.readFileSync('./key/1_www.liudongtushuguan.cn_bundle.crt');

var options = {
	key : key,
	cert : cert,
};

app.use(cookieParser());
app.use(bodyParser.json());

const httpsServer = https.createServer(options,app);
httpsServer.listen(443,() =>{
	console.log('listening 443 port');
});

socket(httpsServer);

app.use(router);

// app.get('/', (req , res) =>{
// 	console.log('someone requested!');
// 	res.cookie('mycookie','value',{time : new Date()});
// 	 res.status(200).send('Welcome to liudongtushuguan!');
// });

// app.get('/cookie',(req , res) => {
// 	console.log(req.cookies);
// 	//var mycookie = req.cookies.mycookie;
// 	res.end('mycookie');
// });

// const wss = new WebSocket.Server({server : httpsServer});

// wss.on('connection',(ws, req) => {
// 		let sessionId = queryString.parse(URL.parse(req.url).query).sessionId;
// 		ws.id = sessionId;
//     console.log('someone connect');
//     console.log(wss.clients);
//     wss.clients.forEach((client) => {
//     	console.log(Object.keys(client));
//     });

//     ws.on('message' , (msg) => {
//     		let msgObj = JSON.parse(msg);
//     		if(sessions[msgObj.targetId]){
//     			wss.clients.forEach((client) => {
// 				if(client.id === msgObj.targetId){
// 					let data = {
// 						time : msgObj.time,
// 						borrower :msgObj.nickName, 
// 						book :msgObj.bookName,
// 						borrowerId : sessions[sessionId],
// 						bookId : msgObj.bookId,
// 						wxNum : msgObj.wxNum,
// 						phoneNum : msgObj.phoneNum,
// 						msg : msgObj.msg
// 					};
// 					client.send(JSON.stringify(data));
// 				}
// 			});
//     		}
//         console.log(msg);
// 				//ws.send('you send '+msg);
//     });
//     //ws.send('hello');
// });


// app.get('/login',(req,res)  => {
// 	res.status(200);
// 	console.log(req.query);
// 	res.json({"code" : req.query});
// });



