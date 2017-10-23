const express = require('express');
const router = express.Router();
const https = require('https');
const queryString = require('querystring');

const APPID = 'wx3e1d175a787899bd';
const SECRET = '65c96753bb7b0bf6499c2df882b2c55a';
const HOST = 'https://api.weixin.qq.com';
const PATH = '/sns/jscode2session';


router.route('/login')
.get((req, res, next) => {
	let code = req.query.code;
	let data = {
		appid : APPID,
		secret : SECRET,
		js_code : code,
		grant_type : 'authorization_code',
	};
	let option = {
		host : HOST,
		path : PATH + '?'+queryString.stringify(data),
		method : 'GET',
	};
	let wxReq = https.request(option, (res) => {
		console.log('request wxopenid');
		if(res.statusCode == 200){
			console.log(res);
			console.log(res.bady);
		}
	});

	console.log(queryString.stringify(data));
	//wxReq.write(queryString.stringify(data));
	wxReq.end();
	res.status(200).send('ok');
	next();
});

module.exports = router;