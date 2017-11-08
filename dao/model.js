const mongoose = require('./db').mongoose;

const Schema = mongoose.Schema;

const UserSchema = new Schema({
	openId : {type: String},
});

const userModel =  mongoose.model('user' , UserSchema);

module.exports = {
	UserModel  : userModel,
}