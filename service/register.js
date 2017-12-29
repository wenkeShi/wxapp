const queryString = require('querystring');

// const DB = require('../dao/db');
// const Model = require('../dao/model');
const sessions = require('./session');

// const DB_CONNECTION = DB.connection;
// const mongoose = DB.mongoose;
// const UserModel = Model.UserModel;
// const BookModel = Model.BookModel;



const APPID = 'wx3e1d175a787899bd';
const SECRET = '65c96753bb7b0bf6499c2df882b2c55a';
const HOST = 'api.weixin.qq.com';
const PATH = '/sns/jscode2session?';


const DATA = {
		appid : APPID,
		secret : SECRET,
		js_code : '',
		grant_type : 'authorization_code',
};
const OPTION = {
		host : HOST,
		path : '',
		method : 'GET',
};

module.exports = (req, res, next) => {
	//console.log(req);
	//headers里的字段以全部被转为小写
	// let sessionId = req.headers.sessionid;
	// if(sessionId){
	// 	console.log(sessions[sessionId]);
	// 	sessions[sessionId] = sessionId;
	// 	next();
	// }else{
		// console.log('no sessionid');
		let code = req.query.code;
		console.log(code );
		let otherRes = res;
		DATA.js_code = code;
		OPTION.path = PATH + queryString.stringify(DATA);
		let wxReq = https.request(OPTION, (res) => {
			if(res.statusCode == 200){
				let json = '';
				res.on('data' , (data) => {
					json+=data;
				});
				res.on('end' , () => {
					console.log(json);
					json =JSON.parse(json);
					let openId = json.openid;
					sessions[openId] = openId;
					console.log(openId);
					otherRes.type('application/json');
					otherRes.json({
						data : {'sessionId' : openId},
					});
					otherRes.status(200);
				});
			}
		});
		wxReq.end();
	//res.status(200);
	//res.type('application/json');
	// }
};