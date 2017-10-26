const express = require('express');
const router = express.Router();
const https = require('https');
const queryString = require('querystring');
const DB = require('../dao/db');
const DB_CONNECTION = DB.connection;
const mongoose = DB.mongoose;

const APPID = 'wx3e1d175a787899bd';
const SECRET = '65c96753bb7b0bf6499c2df882b2c55a';
const HOST = 'api.weixin.qq.com';
const PATH = '/sns/jscode2session';


const DATA = {
		appid : APPID,
		secret : SECRET,
		js_code : '',
		grant_type : 'authorization_code',
};
const OPTION = {
		host : HOST,
		path : PATH + '?',
		method : 'GET',
};

router.route('/login')
.get((req, res, next) => {
	let code = req.query.code;
	DATA.js_code = code;
	OPTION.path += queryString.stringify(DATA);
	let wxReq = https.request(OPTION, (res) => {
	// console.log('request wxopenid');
	if(res.statusCode == 200){
		console.log(Object.keys(res));
		// console.log(res.bady);
		let json = '';

		res.on('data',(data) => {
			json+=data;
		});

		res.on('end',() => {
			json = JSON.parse(json);
			console.log(json);
			
			//user集合模式
			let userSchema = new mongoose.Schema({
				openId : {type: String},
			});
			let UserModel = mongoose.model('user',userSchema);

			UserModel.find({openId:json.openid}, (results) => {
				if(results.length == 0){
					  let user = new UserModel();
					  user.openId = json.openid;
					  user.save((err) => {
					  	console.log('save an user success!');
					  });
				}
			});

			// let sessionSchema = new mongoose.Schema({
			// 	sessionId : {type:String},
			// 	time: {type: Date , default: Date.now}
			// 	validTime : {type: Number, default: 7200}
			// }); 
			// let SessionModel = mongoose.model('session',sessionSchema);
			// SessionModel.find((err, sessions) => {
			// 	console.log(sessions);
			// });			
			// let instance = new SessionModel();
			// instance.sessionId = json.openid + json.session_key;
			// instance.save((err) => {
			// 	console.log(err);
			// });
		});
	}
	});
	wxReq.end();
	console.log(queryString.stringify(DATA));
	//wxReq.write(queryString.stringify(data));
	res.status(200).send('ok');
	next();
});


module.exports = router;