const express = require('express');
const router = express.Router();
const https = require('https');
const queryString = require('querystring');
const bodyParser = require('body-parser');




const DB = require('../dao/db');
const Model = require('../dao/model');


const DB_CONNECTION = DB.connection;
const mongoose = DB.mongoose;
const UserModel = Model.UserModel;
const BookModel = Model.BookModel;



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
var   sessions = {};


router.use(bodyParser.json());
router.all('*',(req, res, next) => {
	//console.log(req);
	//headers里的字段以全部被转为小写
	let sessionId = req.headers.sessionid;
	if(sessionId){
		console.log(sessions[sessionId]);
		sessions[sessionId] = sessionId;
		next();
	}else{
		console.log('no sessionid');
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
	}
})


.get('/login',(req, res, next) => {			
// let code = req.query.code;
// 	DATA.js_code = code;
// 	OPTION.path = PATH + queryString.stringify(DATA);
// 	let wxReq = https.request(OPTION, (res) => {
	// console.log('request wxopenid');
	// if(res.statusCode == 200){
	// 	console.log(Object.keys(res));
		// console.log(res.bady);
		// let json = '';

		// res.on('data',(data) => {
		// 	json+=data;
		// });

		// res.on('end',() => {
		// 	json = JSON.parse(json);
		// 	console.log(json);

			//user集合模式
			// let userSchema = new mongoose.Schema({
			// 	openId : {type: String},
			// });
			// let UserModel = mongoose.model('user',userSchema);
			let sessionId = req.headers.sessionid;
			let openId = sessions[sessionId];
			console.log('sessions----------------'+sessions[sessionId]);
			UserModel.find({openId:openId}, (err,results) => {
				if(results.length == 0){
					  let user = new UserModel();
					  user.openId = openId;
					  user.save((err) => {
					  	console.log('save an user success!');
					  });
				}else{
					console.log('user had exist');
				}
			});

			res.status(200).end();
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
	// 	});
	// }
	// });
	// wxReq.end();
	// console.log(queryString.stringify(DATA));
	//wxReq.write(queryString.stringify(data));
	// res.status(200).send('ok');
	next();
})


.post('/publish', (req, res, next) => {
	let sessionId = req.headers.sessionid;
	let openid = sessions[sessionId];
	let data = req.body;
	let book = new BookModel(data);
	book.ownerId = openid;
	book.save();
	UserModel.find({openId : openid} , (err, results) => {
		results[0].publishedBooks.unshift(book);
		results[0].save();
	});
	res.status(200).end();
	next();
})

.get('/publishedbooks',(req, res, next) => {
	let sessionId = req.headers.sessionid;
	let openid = sessions[sessionId];
	UserModel.find({openId : openid} , (err, results) => {
		// res.type('application/json');  用res.json可省略这步
		//res.json({
		//	publishedBooks : results[0].publishedBooks
		//});
		//res.status(200).end();    //res.end()用于不带数据的快速返回请求 如果要带数据，用res.json 或者res.send
		res.status(200).json({
			publishedBooks : results[0].publishedBooks
		});
		next();       //next()一定是在异步处理完之后调用        
	});
	//next() 这里用next的话会在查找的异步结果返回之前就执行next,这就可能导致查找结果返回前服务器就已经返回响应数据了。
}) 

.get('/books', (req, res, next) => {
	let condition = req.query.tag;
	if(condition=="all") condition='.';
	let reg = new RegExp(condition,'i');
	BookModel.find({tags : reg}, (err, results) => {
		// res.type('application/json');
		res.json({
			books : results
		});
		res.status(200);
		next();
	});
});

module.exports = {router : router,
	sessions  : sessions,
};