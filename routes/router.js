const express = require('express');
const router = express.Router();
const https = require('https');
const queryString = require('querystring');
const bodyParser = require('body-parser');




const DB = require('../dao/db');
const Model = require('../dao/model');
const sessions = require('../service/session');

//接口服务
const register = require('../service/register');
const login = require('../service/login');
const publish = require('../service/publish');
const getPublishBooks = require('../service/getPublishBooks');
const getBooks = require('../service/getBooks');
const getNewBooks = require('../service/getNewBooks');
const getBookStatus require('../service/getBookStatus');
const getOwnerInfo = require('../servie/getOwnerInfo');
const getOwnerPublished =require('../service/getOwnerPublished');
const borrow = require('../service/borrow');
const getBorrowBooks = require('../service/getBorrowBooks');
const borrowMsg = require('../service/borrowMsg');
const getBorrowMsgs = require('../service/getBorrowMsgs');
const agree = require('../service/agree');
const reject = require('../service/reject');

const DB_CONNECTION = DB.connection;
const mongoose = DB.mongoose;
const UserModel = Model.UserModel;
const BookModel = Model.BookModel;

router.use(bodyParser.json());
router.get('/register', register)
.get('/login',login)

//发布书籍
.post('/publish', publish)

//获取发布的图书
.get('/publishedbooks',getPublishBooks) 

//获取某类书籍
.get('/books', getBooks)

//获取最新发布的图书
.get('/newbooks', getNewBooks)

//查询书籍可借的状态
.get('/book/status', getBookStatus)

//获取书籍主人信息
.get('/book/ownerInfo',getOwnerInfo)

//获取书主发布的图书
.get('/owner/publishedbooks', getOwnerPublished)

//借阅书籍接口
.post('/borrowBook',borrow)

//获取借阅的书籍
.get('/borrowedbooks' , getBorrowBooks)

//新增借阅消息
.post('/borrowMsg', borrowMsg)

//获取借阅消息
.get('/message/borrowMsgs', getBorrowMsgs)

//同意借阅
.post('/agree', agree)

//拒绝借阅
.post('/reject', reject)

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
//	UserModel.findOne({openId : borrowerId}, (err, borrower) => {
//		if(!err){
//			for(let i=0;i<borrower.borrowedBooks.length;i++){
//				if(borrower.borrowedBooks[i].bookId == bookId){
//			  	borrower.borrowedBooks[i].borrowingStatus = '已归还';
//			  	break;
//			  }
//			}
//			borrower.markModified('borrowedBooks');
//			borrower.save();
//			res.status(200).send();
//			next();
//		}else{
//			console.log(err);
//		}
//	});
	UserModel.update({openId : borrowerId, "borrowedBooks.bookId" : bookId}, {$set: {"borrowedBooks.$.borrowingStatus" : '已归还' } } ,(err, result) => {
		if(!err){
			res.status(200).send();
			next();
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
};