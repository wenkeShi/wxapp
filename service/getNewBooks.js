const BookModel = require('../dao/model').BookModel;
const sessions = require('./session');

module.exports = (req, res, next) => {
	BookModel.find({status : true}, (err, books) => {
		if(err){
			console.log(err);
		}else{
			res.status(200).json({
				"newPublishedBooks" : books.slice(-6)
			});
		}
	});	
}