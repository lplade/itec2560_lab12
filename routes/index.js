var express = require('express');
var router = express.Router();
var passport = require('passport');

/* GET home page. */
router.get('/', function(req, res, next) {
	//This will probably be the home page for your application
	//Let's redirect to the signup page
	res.redirect('/signup');
});

/* GET signup page */
router.get('/signup', function(req, res, next){
	res.render('signup', { message : req.flash('signupMessage') } )
});

/* POST signup - this is called by clickiing signup button on form
* * Call passport.authenticate with these arguments:
* what method to use in this cae, local-signup, define in /config/passport.js
* what to do in event of success
* what to do in event of failure
* whether to display flash messages to user */
router.post('/signup', passport.authenticate('local-signup', {
	successRedirect: '/secret',
	failureRedirect: '/signup',
	failureFlash: true
}));

/* GET secret page. Note isLoggedIn middleware - verify if user is logged in */
router.get('/secret', isLoggedIn, function(req, res, next) {
	res.render('secret', {user: req.user});
});

/* Middleware fucntion. If user is logged in, call next - this calls the next
middleware (if any) to continue chain of request processing. Typically, this will
end up with the route handler that use this middleware being called,
for exapmple GET /secret.

If the user is not logged in, call res.recdirect to send them back to the home page
Could also send them to the login or signup pages if you prefer
res.redirect ends the request handling for this request,
so the route handle that uses this middleware (in this example, GET /secret) never runs.
 */
function isLoggedIn(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	}
	res.redirect('/');
}

module.exports = router;
