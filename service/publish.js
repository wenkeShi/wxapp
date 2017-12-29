const Model = require('../dao/model');
const sessions = require('./session');

const UserModel = Model.UserModel;
const BookModel = Model.BookModel;


//发布图书
module.exports = (req, res, next) => {
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
};