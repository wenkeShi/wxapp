const sessions = require('./session');
const UserModel = require('../dao/model').UserModel;
const BookModel = require('../dao/model').BookModel;


module.exports = (req, res, next) => {
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
//	UserModel.findOne({openId : body.borrowerId}, (err, borrower) => {
//		if(!err){
//			for(let i=0;i<borrower.borrowedBooks.length;i++){
//				if(borrower.borrowedBooks[i].bookId == bookId){
//			  	borrower.borrowedBooks[i].borrowingStatus = '借阅失败';
//			  	break;
//			  }
//			}
//			borrower.markModified('borrowedBooks');
//			borrower.save();
//			res.status(200).send();
//		}else{
//			console.log(err);
//		}
//	});
	UserModel.update({openId : body.borrowerId, "borrowedBooks.bookId" : bookId}, {$set: {"borrowedBooks.$.borrowingStatus" : '借阅失败' } } ,(err, result) => {
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
}