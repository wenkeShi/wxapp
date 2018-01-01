const sessions = require('./session');
const UserModel = require('../dao/model').UserModel;


module.exports = (req, res, next) => {
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
}