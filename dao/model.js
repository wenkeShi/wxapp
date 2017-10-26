const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const Model = mongoose.model;

const UserSchema = new Schema({
	openId : {type: String},
});

module.exports = {
	UserModel : new Model('user' , UserSchema),
}