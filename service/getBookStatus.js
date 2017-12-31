const BookModel = require('../dao/model').BookModel;

module.exports = (req, res, next) => {
	let isbn = req.query.isbn;
	let canBorrow = 0;
	BookModel.find({isbn:isbn},(err, results) => {
		results.forEach((book) => {
		  book.status ? canBorrow++ : null;
		});
		res.status(200).json({
			canBorrow : canBorrow,
			total : results.length,
		});
		next();
	});
}