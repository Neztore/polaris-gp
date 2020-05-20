const rateLimit = new Map();
const maxReqs = 30;
const time = 60;
const settings = require('../settings.json');

module.exports = function (req, res, next) {
	// Validate global auth keys.
	if (!req.headers.authorization) {
		return res.status(401).send({error: {status: 401, message: "You must pass an auth token."}});
	} else {
		const parts = req.headers.authorization.split(':');
		if (parts.length === 2) {
			if (parts[0] === settings.securityToken) {
				// Its good: Pass on.
				req.headers.authorization = parts[1];
				if (checkCentre(parts[1])) {
					log(`Request from ${req.ip} accepted.`);
					next();
				} else {
					res.status(429).send({error: {status: 429, message: "Too many requests. Slow down!"}});
					log(`Request from ${req.ip} rejected.`);
				}
			} else {
				res.send(401).send({error: {status: 401, message: "Incorrect security token"}});
			}
		} else {
			return res.status(401).send({error: {status: 401, message: "You must provide both Polaris security token and centre token."}});
		}
	}
};


function checkCentre (auth) {
	const userLimit = rateLimit.get(auth);
	if (userLimit) {
		// If user is over the limit, check the time
		if (userLimit.requests >= maxReqs) {
			if (!(Date.now() - userLimit.set > (time * 1000))) {
				userLimit.requests += 1;
				rateLimit.set(auth, userLimit);
				return false;
			} else {
				// it's fine due to time
				rateLimit.set(auth, {
					set: Date.now(),
					requests: 1
				});
				return true;
			}
		} else {
			//they're ok
			userLimit.requests += 1;
			rateLimit.set(auth, userLimit);
			return true;
		}
	} else {
		// they havent sent before
		rateLimit.set(auth, {
			set: Date.now(),
			requests: 1
		});
		return true;
	}
}
const log = (...args)=> {
	const date = new Date();
	console.log(`${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}: `, ...args);
};