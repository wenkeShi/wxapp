const UserModel = require('../dao/model').UserModel;
const BookModel = require('../dao/model').BookModel;
const sessions = require('./session');

module.exports = (req, res, next) => {
	let borrowedBook = req.body;
	let bookId = borrowedBook.bookId;
	let userId = sessions[req.headers.sessionid];

	BookModel.findOne({_id : bookId} , (err, book) => {
		if(!err&&book.status){     //保证书籍还未被借阅
			book.status = false;
			book.save((err) => {
				if(err){
					console.log('save book failed!');
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

		}else{
			res.status(200).json({
				error : '已被借阅'
			});
			next();
			//console.log('find book failed!');
			return;
		}
	});
			
}