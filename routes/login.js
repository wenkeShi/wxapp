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

//发布书籍
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

//获取发布的图书
.get('/publishedbooks',(req, res, next) => {
	let sessionId = req.headers.sessionid;
	let openid = sessions[sessionId];
	UserModel.findOne({openId : openid} , (err, user) => {
		// res.type('application/json');  用res.json可省略这步
		//res.json({
		//	publishedBooks : results[0].publishedBooks
		//});
		//res.status(200).end();    //res.end()用于不带数据的快速返回请求 如果要带数据，用res.json 或者res.send
		res.status(200).json({
			publishedBooks : user.publishedBooks 
		});
		next();       //next()一定是在异步处理完之后调用        
	});
	//next() 这里用next的话会在查找的异步结果返回之前就执行next,这就可能导致查找结果返回前服务器就已经返回响应数据了。
}) 

//获取某类书籍
.get('/books', (req, res, next) => {
	let condition = req.query.tag;
	if(condition=="all") condition='.';
	let reg = new RegExp(condition,'i');
	BookModel.find({tags : reg,status : true}, (err, results) => {
		// res.type('application/json');
		res.json({
			books : results
		});
		res.status(200);
		next();
	});
})

//查询书籍可借的状态
.get('/book/status', (req, res, next) => {
	let isbn = req.query.isbn;
	let canBorrow = 0;
	BookModel.find({isbn:isbn},(err, results) => {
		results.forEach((book) => {
		  book.status ? canBorrow++ : null;
		});
		res.status(200).json({
			canBorrow : canBorrow,
			total : results.length,
		});
		next();
	});
})

//获取书籍主人信息
.get('/book/ownerId',(req, res, next) => {
		let bookId = req.query.bookId;
		BookModel.findOne({_id : bookId},(err, result) => {
			res.status(200).json({
				ownerId : result.ownerId,
			});
			next();
		});
})

//借阅书籍接口
.post('/borrowBook',(req, res, next) => {
	let borrowedBook = req.body;
	let bookId = borrowedBook.bookId;
	let userId = sessions[req.headers.sessionid];

	BookModel.findOne({_id : bookId} , (err, book) => {
		if(!err){
			book.status = false;
			book.save((err) => {
				if(err){
					console.log('save book failed!');
				}
			});

		}else{
			console.log('find book failed!');
		}
	});
			UserModel.findOne({openId : userId}, (err, user) => {
				if(!err){
					borrowedBook.borrowingStatus = '申请借阅中';
					borrowedBook.borrowerId = userId;
					//添加微信号和手机号
					user.borrowedBooks.unshift(borrowedBook);
					user.markModified('borrowedBooks');
					 user.save((err) => {
						if(!err){
							res.status(200).end();
							next();
						}else{
							console.log('save user failed!');
							console.log(err);
						}
					});
				}else{
					console.log('find user failed!');
				}
			});	
})

//获取借阅的书籍
.get('/borrowedbooks' , (req, res, next) => {
	let userId = sessions[req.headers.sessionid];
	UserModel.findOne({openId : userId} , (err, user) => {
		if(!err){
			res.status(200).json({
				borrowedBooks : user.borrowedBooks,
			});
			next();
		}else{
			console.log('find user failed!');
		}
	});
})

//新增借阅消息
.post('/borrowMsg', (req, res, next) => {
	let userId = sessions[req.headers.sessionid];
	let msgData = req.body;
	let targetId = msgData.targetId;
	msgData.borrowerId = userId;   //前端传了bookid才能save成功？！不知道为什么
console.log(targetId);
	UserModel.findOne({openId : targetId}, (err, user) => {
		if(!err){
			console.log(user);
			user.borrowMessages.unshift(msgData);
			user.markModified('borrowMessages');
			console.log(user.borrowMessages);
			user.save((err) => {
				if(!err){
					res.status(200).send();
					next();
				}else{
					console.log(err);
					console.log('save user failed!');
				}
			});
		}else{
			console.log('find user failed!');
		}
	});
})

//获取借阅消息
.get('/message/borrowMsgs', (req, res, next) => {
	let userId = sessions[req.headers.sessionid];
	UserModel.findOne({openId : userId} , (err, user) => {
		res.status(200).json({
			borrowMessages : user.borrowMessages,
		});
		next();
	});
})
//同意借阅
.post('/agree',(req, res, next) => {
	let body = req.body;
	let userId = sessions[req.headers.sessionid];
	let bookId = body.bookId;
	UserModel.findOne({openId : userId}, (err, owner) =>{
		if(!err){
			for(let i=0;i<owner.publishedBooks.length;i++){
console.log('--------------------------------------------------------------------------------------');
				console.log(owner.publishedBooks[i]._id);
				console.log(bookId);
				if(owner.publishedBooks[i]._id == bookId){
				console.log('find----------------------------------------------------------------');
			  	owner.publishedBooks[i].borrower = body.borrower;
			  	owner.publishedBooks[i].borrowerId = body.borrowerId; //可以考虑加上borrowId
			  	break;
			  }
			}
			for(let i=0;i<owner.borrowMessages.length;i++){
				if(owner.borrowMessages[i].bookId == bookId){
					owner.borrowMessages.splice(i,1);
					break;
				}
			}
			console.log(owner.publishedBooks);
			owner.markModified('publishedBooks');
			owner.markModified('borrowMessages');
			owner.save((err) => {if(err) console.log(err)});
		}else{
			console.log(err);
		}
	});
	UserModel.findOne({openId : body.borrowerId}, (err, borrower) => {
		if(!err){
			for(let i=0;i<borrower.borrowedBooks.length;i++){
				if(borrower.borrowedBooks[i].bookId == bookId){
				console.log('--------------------------------------------borrowedBooks')
				borrower.borrowedBooks[i].borrowingStatus = '借阅中';
			  	borrower.borrowedBooks.set(i,borrower.borrowedBooks[i]);
				//borrower.markModified('borrowedBooks');
			borrower.save((err) => {console.log('----------------------------errro');if(err) console.log(err)});
			res.status(200).send();
			next();
			  	break;
			  }
			}
			console.log(borrower.borrowedBooks);
			//borrower.markModified('borrowedBooks.borrowingStatus ');
			//borrower.borrowedBooks.splice(0,0);

		}else{
			console.log(err);
		}
	});
})


//拒绝借阅
.post('/reject', (req, res, next) => {
	let body = req.body;
	let userId = sessions[req.headers.sessionid];
	let bookId = body.bookId;
	UserModel.findOne({openId : userId}, (err, owner) =>{
		if(!err){
			for(let i=0;i<owner.borrowMessages.length;i++){
				if(owner.borrowMessages[i].bookId == bookId){
					owner.borrowMessages.splice(i,1);
					break;
				}
			}
			owner.markModified('borrowMessages');
			owner.save();
		}else{
			console.log(err);
		}
	});
	UserModel.findOne({openId : body.borrowerId}, (err, borrower) => {
		if(!err){
			for(let i=0;i<borrower.borrowedBooks.length;i++){
				if(borrower.borrowedBooks[i].bookId == bookId){
			  	borrower.borrowedBooks[i].borrowingStatus = '借阅失败';
			  	break;
			  }
			}
			borrower.markModified('borrowedBooks');
			borrower.save();
			res.status(200).send();
		}else{
			console.log(err);
		}
	});
	BookModel.findOne({_id : bookId}, (err, book) => {
		book.status = true;
		book.save();
		res.status(200).send();
		next();
	});
})

//归还书籍
.get('/returnbook', (req, res, next) => {
	let userId = sessions[req.headers.sessionid];
	let bookId = req.query.bookId;
	UserModel.findOne({openId : userId}, (err, user) => {
		if(!err){
			for(let i=0;i<user.borrowedBooks.length;i++){
				if(user.borrowedBooks[i].bookId == bookId){
			  	user.borrowedBooks[i].borrowingStatus = '归还中';
			  	break;
			  }
			}
			user.markModified('borrowedBooks');
			user.save();
			res.status(200).send();
			next();
		}else{
			console.log(err);
		}
	});
})

//收到书籍
.post('/receivebook',(req, res, next) => {
	let userId = sessions[req.headers.sessionid];
	let body = req.body;
	let bookId = body.bookId;
	let borrowerId = body.borrowerId;
	UserModel.findOne({openId : userId}, (err, owner) =>{
		if(!err){
			for(let i=0;i<owner.publishedBooks.length;i++){
				if(owner.publishedBooks[i]._id == bookId){
			  	owner.publishedBooks[i].borrower = '';
			  	owner.publishedBooks[i].borrowerId = ''; //可以考虑加上borrowId
			  	break;
			  }
			}
			owner.markModified('publishedBooks');
			owner.save();
		}else{
			console.log(err);
		}
	});
	UserModel.findOne({openId : borrowerId}, (err, borrower) => {
		if(!err){
			for(let i=0;i<borrower.borrowedBooks.length;i++){
				if(borrower.borrowedBooks[i].bookId == bookId){
			  	borrower.borrowedBooks[i].borrowingStatus = '已归还';
			  	break;
			  }
			}
			borrower.markModified('borrowedBooks');
			borrower.save();
			res.status(200).send();
			next();
		}else{
			console.log(err);
		}
	});
	BookModel.findOne({_id : bookId}, (err, book) => {
		book.status = true;
		book.save();
		res.status(200).send();
		next();
	});
})


module.exports = {
	router : router,
	sessions  : sessions,
};