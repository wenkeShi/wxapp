const BookModel = require('../dao/model').BookModel;
const sessions = require('./session');

module.exports = (req, res, next) => {
	let condition = req.query.tag;
	if(condition=="all") condition='.';
	let reg = new RegExp(condition,'i');
	BookModel.find({tags : reg,status : true}, (err, results) => {
		// res.type('application/json');
		res.json({
			books : results
		});
		res.status(200);
		next();
	});
}