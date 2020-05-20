const express = require('express');
const router = express.Router();
const settings = require("../settings.json");
const { setRank } = require('../util/Roblox.js');

// TODO: Refactor
// This is a mess. Validations could be done better.

router.get('/', function (req, res) {
	res.status(200).send({message: "Centre home page", status: 200});
});
const catchAsyncErrors = fn => (
    (req, res, next) => {
        const routePromise = fn(req, res, next);
        if (routePromise.catch) {
            routePromise.catch(err => next(err));
        }
    }
);
// Get centre settings.
router.get('/:id', function (req, res) {
	if (req.params.id) {
		// Check auth
		const opt = settings.centres[req.params.id];
		if (opt) {
			if (opt.auth.includes(req.headers.authorization)) {
				res.send({message: "OK!", status: 200, active: true});
			} else {
				return res.status(401).send({error: {status: 401, message: "Unauthorised"}});
			}
		} else {
			res.status(400).send({error: {message: "Centre not found."}, status: 400});
		}
	}
});

router.post('/:id/rank/:groupId', catchAsyncErrors(async function (req, res) {
	if (req.params.id && req.params.groupId && validNum(req.params.groupId)) {
		// Check auth
		const opt = settings.centres[req.params.id];
		if (opt) {
			if (opt.auth.includes(req.headers.authorization)) {
				// Req. is auth and good.
				if (validNum(req.params.groupId) && opt.groups.includes(parseInt(req.params.groupId, 10))) {
					if (req.body.newRank && validNum(req.body.newRank)) {
					    if (!req.body.userId || !validNum(req.body.userId)) {
								return res.status(400).send({ error: { status: 400, message: `User id must be a number` } });
							}
						const rank = parseInt(req.body.newRank, 10);
						if (rank > 0 && rank < 255) {
                            const succ = await setRank(req.body.userId, req.params.groupId, req.body.newRank);
                            if (!succ) {
                                // didnt rank
                                res.status(500).send({error: {message: "Failed to set rank"}})
                            } else if (succ.error) {
                                succ.error.status = 500;
                                res.status(500).send(succ);
                            } else {
                                res.send({status: 200, message: "Ranked."});
                            }

						} else {
							res.status(400).send({error: {status: 400, message: "New rank must be between 0 and 255."}});
						}

					} else {
						res.status(400).send({error: {status: 400, message: "newRank must be a number."}});
					}

				} else {
					res.status(400).send({error: {status: 400, message: "Bad group id."}});
				}

			} else {
				return res.status(401).send({error: {status: 401, message: "Unauthorised"}});
			}
		} else {
			res.status(404).send({message: "Centre not found."});
		}
	} else {
		res.status(400).send({error:{status: 400, message: "Bad request: Both centre id and groupId are required."}});
	}
}));
const validNum = (n)=>!isNaN(n);





module.exports = router;