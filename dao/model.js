
const mongoose = require('./db').mongoose;

const Schema = mongoose.Schema;

const UserSchema = new Schema({
	openId : {type: String},
	publishedBooks : {type: Array},
	borrowedBooks : {type: Array},
	borrowMessages : Array, 
});

const BookSchma = new Schema({
	isbn : String,
	title : String,
	press : String,
	author : String,
	rate : String,
	tags : String,
	image : String,
	status : {type : Boolean,default : true},
	ownerId : String,
	owner : String,
	ownerImage : String,
	//borrowerId : String,
});
// const BorrowMsgSchma = new Schema({
// 	time : Date,
// 	borrower : String,
// 	book : String,
// 	wxNumber : String,
// 	phoneNumber : String,
// });
const userModel =  mongoose.model('user' , UserSchema);
const bookModel = mongoose.model('book' , BookSchma);

module.exports = {
	UserModel  : userModel,
	BookModel : bookModel,
}