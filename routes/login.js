const express = require('express');
const router = express.Router();
const https = require('https');
const queryString = require('querystring');

const APPID = 'wx3e1d175a787899bd ';
const SECRET = '65c96753bb7b0bf6499c2df882b2c55a';
const HOST = 'https://api.weixin.qq.com';
const PATH = '/sns/jscode2session';

router.route('/login')
.get((req, res, next) => {
	let code = req.query.code;

	let option = {
		host : HOST,
		path : PATH,
		method : 'GET',
	};
	let req = https.request(option, (res) => {
		if(res.statusCode == 200){
			console.log(res);
			console.log(res.bady);
		}
	});
	let data = {
		appid : APPID,
		secret : SECRET,
		js_code : code,
		grant_type : 'authorization_code',
	};
	req.write(querystring.stringify(data));
	req.end();
	next();
});

module.exports = router;