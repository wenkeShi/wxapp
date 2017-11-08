
const mongoose = require('./db').mongoose;

const Schema = mongoose.Schema;

const UserSchema = new Schema({
	openId : {type: String},
	publishedBooks : {type: Array},
	borrowedBooks : {type: Array}, 
});

const BookSchma = new Schema({
	isbn : String,
	title : String,
	press : String,
	author : String,
	rate : String,
	tags : String,
	status : true,
	ownerId : String,
	borrowerId : String,
});
const userModel =  mongoose.model('user' , UserSchema);
const bookModel = mongooose.model('book' , BookSchma);

module.exports = {
	UserModel  : userModel,
	BookModel : bookModel,
}