const sessions = require('./session');
const UserModel = require('../dao/model').UserModel;


module.exports = (req, res, next) => {
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
}