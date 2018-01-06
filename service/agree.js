const sessions = require('./session');
const UserModel = require('../dao/model').UserModel;


module.exports = (req, res, next) => {
	let body = req.body;
	let userId = sessions[req.headers.sessionid];
	let bookId = body.bookId;
	UserModel.findOne({openId : userId}, (err, owner) =>{
		if(!err){
			for(let i=0;i<owner.publishedBooks.length;i++){
				console.log(owner.publishedBooks[i]._id);
				console.log(bookId);
				if(owner.publishedBooks[i]._id == bookId){  //_id是ObjectId类型的
			  	owner.publishedBooks[i].borrower = body.borrower;
			  	owner.publishedBooks[i].borrowerId = body.borrowerId; //可以考虑加上borrowId
				owner.publishedBooks.unshift(owner.publishedBooks.splice(i,1)[0]); //将被借阅的书籍调到借阅书籍最前
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
	//UserModel.findOne({openId : body.borrowerId}, (err, borrower) => {
	//	if(!err){
	//		for(let i=0;i<borrower.borrowedBooks.length;i++){
	//			if(borrower.borrowedBooks[i].bookId == bookId){
	//			console.log('--------------------------------------------borrowedBooks')
	//			borrower.borrowedBooks[i].borrowingStatus = '借阅中';
	//		  	borrower.borrowedBooks.set(i,borrower.borrowedBooks[i]);
	//			//borrower.markModified('borrowedBooks');
	//		borrower.save((err) => {console.log('----------------------------errro');if(err) console.log(err)});
	//		res.status(200).send();
	//		next();
	//		  	break;
	//		  }
	//		}
	//		console.log(borrower.borrowedBooks);
	//		//borrower.markModified('borrowedBooks.borrowingStatus ');
	//		//borrower.borrowedBooks.splice(0,0);

	//	}else{
	//		console.log(err);
	//	}
	//});
	UserModel.update({openId : body.borrowerId, "borrowedBooks.bookId" : bookId}, {$set: {"borrowedBooks.$.borrowingStatus" : '借阅中' } } ,(err, result) => {
		if(!err){
			res.status(200).send();
			next();
		}
	});
}