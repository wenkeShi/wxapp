const https = require('https');
const fs = require('fs');
const cookieParser = require('cookie-parser');
const app = require('express')();
const login = require('./routes/login');
// var http = require('http');

//读取证书文件
var key = fs.readFileSync('./key/2_www.liudongtushuguan.cn.key');
var cert = fs.readFileSync('./key/1_www.liudongtushuguan.cn_bundle.crt');

var options = {
	key : key,
	cert : cert,
};

app.use(cookieParser());
const httpsServer = https.createServer(options,app);
httpsServer.listen(443,() =>{
	console.log('listening 443 port');
});

app.use(login);
app.get('/', (req , res) =>{
	console.log('someone requested!');
	res.cookie('mycookie','value',{time : new Date()});
	 res.status(200).send('Welcome to liudongtushuguan!');
});

app.get('/cookie',(req , res) => {
	console.log(req.cookies);
	//var mycookie = req.cookies.mycookie;
	res.end('mycookie');
});

// app.get('/login',(req,res)  => {
// 	res.status(200);
// 	console.log(req.query);
// 	res.json({"code" : req.query});
// });


