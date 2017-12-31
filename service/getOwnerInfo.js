const BookModel = require('../dao/model').BookModel;

module.exports = (req, res, next) => {
		let bookId = req.query.bookId;
		BookModel.findOne({_id : bookId},(err, book) => {
			console.log(book);
			console.log( book.owner+book.ownerImage);
			res.status(200).json({
				ownerId : book.ownerId,
				owner : book.owner,
				ownerImage : book.ownerImage,
			});
			next();
		});
}