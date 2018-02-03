const sessions = require('./session');
const UserModel = require('../dao/model').UserModel;
const BookModel = require('../dao/model').BookModel;


module.exports = (req, res, next) => {
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
}