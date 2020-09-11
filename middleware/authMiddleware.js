const jwt = require('jsonwebtoken');
const User = require('../models/User');

const requireAuth = async (req, res, next) => {
	const token = req.cookies.jwt;
	if (token) {
		try {
			await jwt.verify(token, 'Secret');
			next();
		} catch (err) {
			console.log(err.message);
			res.redirect('/login');
		}
	} else {
		res.redirect('/login');
	}
};

const checkUser = async (req, res, next) => {
	const token = req.cookies.jwt;
	if (token) {
		try {
			const decodedToken = await jwt.verify(token, 'Secret');
			let user = await User.findById(decodedToken.id);
			res.locals.user = user;
			next();
		} catch (err) {
			res.locals.user = null;
			next();
		}
	} else {
		res.locals.user = null;
		next();
	}
};

module.exports = { requireAuth, checkUser };
