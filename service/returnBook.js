const sessions = require('./session');
const UserModel = require('../dao/model').UserModel;


module.exports = (req, res, next) => {
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
}