const mongoose = require('mongoose');

const connection = mongoose.connect('mongodb://127.0.0.1/wxapp');

// const connection = mongoose.connection;
connection.on('connected', (err) => {
	if(err){
		console.log('Database connection failure');
	}
});

connection.on('error',(err) => {
	console.log('Mongoose connected error '+ err);
});

connection.on('disconnected', () => {
	console.log('Mongoose disconnected');
});

module.exports = {
	connection : connection,
	mongoose : mongoose,
};

