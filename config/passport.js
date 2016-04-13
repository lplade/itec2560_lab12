var LocalStrategy = require('passport-local').Strategy;

var User = require('../models/user');

module.exports = function (passport) {
	//Passport session setup. Need the ability to
	//Serialize (save to disk - a database) and
	// unserialize (extract from database) sessions.

	//save user in session store.
	passport.serializeUser(function (user, done) {
		done(null, user.id);
	});

	//Get user by ID, from session store
	passport.deserializeUser(function (id, done) {
		User.findById(id, function (err, user) {
			done(err, user);
		})
	});

	//Sign up new user
	passport.use('local-signup', new LocalStrategy({
		usernameField: 'username',
		passwordField: 'password',
		passReqToCallback: true
	}, function (req, username, password, done) {

		//https://nodejs.org/api/process.html#process_process_nexttick_callback_arg
		//Once the current event loop turn runs to completion, call the callback function.
		process.nextTick(function () {

			//Search for user with this username.
			User.findOne({'local.username': username}, function (err, user) {
				if (err) {
					return done(err); //database error
				}

				//Check to see if there is already a user with that username
				if (user) {
					console.log('user with that name exists');
					return done(null, false, req.flash('signupMessage', 'Sorry, username already taken'));
				}

				//else, the username is available. Create a new user, and save to DB.
				var newUser = new User();
				newUser.local.username = username;
				newUser.local.password = newUser.generateHash(password);

				newUser.save(function (err) {
					if (err) {
						throw err;
					}
					//If new user is saved successfully, all went well. Return new user object.
					return done(null, newUser)
				})
			})
		})
	}));
	passport.use('local-login', new LocalStrategy({
		usernameField:'username',
		passwordField:'password',
		passReqToCallback: true
	},

	function(req, username, password, done){
		process.nextTick(function(){
			User.findOne({'local.username': username}, function (err, user) {

				if (err) {
					return done(err)
				}
				if (!user) {
					return done(null, false, req.flash('loginMessage', 'User not found'))
				}
				//This method is defined in our user.js model
				if (!user.validPassword(password)) {
					return done(null, false, req.flash('loginMessage', 'Wrong password'));
				}

				return done(null, user);
			})
		});
	}));
	
}; //End of outermost callback!
