var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

var userSchema = mongoose.Schema({

	local : {
		user : String,
		password : String
	}
});

userSchema.methods.generateHas = function(password) {
	//Create salted hash of password by hashing plaintext password
	return bcrypt.hashSync(password, bcrypt.genSaltSync(8));
};

userSchema.methods.validPassword = function(password) {
	//Hash entered password, compare with stored hash
	return bcrypt.compareSync(password, this.local.password);
};

module.export = mongoose.model('User', userSchema);