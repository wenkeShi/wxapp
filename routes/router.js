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
const returnBook = require('../service/returnBook');
const receiveBook = require('../service/receiveBook');

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
.get('/returnbook', returnBook)

//收到书籍
.post('/receivebook',receiveBook)


module.exports = {
	router : router,
};