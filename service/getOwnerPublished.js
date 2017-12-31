const UserModel = require('../dao/model').UserModel;

module.exports = (req, res, next) => {
	let ownerId = req.query.ownerId;
	UserModel.findOne({openId : ownerId} , (err, owner) => {
		if(err){
			console.log(err);
		}else{
			res.status(200).json({
				"publishedBooks" : owner.publishedBooks
			});
			next();
		}
	});
}