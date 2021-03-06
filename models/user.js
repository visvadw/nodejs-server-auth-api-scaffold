const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');


// ---------------
// define our model
// ---------------

const userSchema = new Schema({
	email: { type: String, unique: true, lowercase: true },
	password: String
});

// before 'save' on user, encrypt his password
userSchema.pre('save', function(next) {

	const user = this;
	bcrypt.genSalt(10, function(err, salt) {
		if (err) return next(err);
		bcrypt.hash(user.password, salt, null, function(err,hash) {
			if (err) return next(err);
			// set the encrypted password
			user.password = hash;
			next();
		})
	})
});

userSchema.methods.comparePassword = function(candidatePassword, callback) {
	bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
		if (err)
			return callback(err);
		callback(null, isMatch);
	});
}


// ----------------------
// create the model class
// ----------------------

const UserClass = mongoose.model('user', userSchema);

// ----------------
// export the model
// ----------------

module.exports = UserClass;