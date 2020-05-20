/**
 * Manages bloxy and connectiongs to Roblox.
 */
const settings = require("../settings.json");
const noblox = require("noblox.js")


const userRanks = {};
noblox.cookieLogin(settings.cookie).then(async function () {
	const user = await noblox.getCurrentUser();
	if (!user) {
		return console.log(`No user!`)
	}
	let r = await noblox.getGroups(user.UserID);
	for (let g of r) {
		userRanks[g.Id] = g.Rank;
	}
    console.log(`Logged in as ${user.UserName}`);
}).catch(function (e) {
    console.log(`Failed to fetch groups: ${e.message}`);
})
	.catch(function (e) {
	console.log(`Failed to login: ${e.message}`);
})
;
/**
 *
 * @param userId - The Roblox userId of the user to promote
 * @param groupId - The groupid to promote them in
 * @param newRank - The rank to promote them to
 * @return {boolean | object} - success or error
 */
async function setRank(userId, groupId, newRank) {
	if (!userRanks[groupId]) {
		return {error: {message: "Bot is not in group."}};
	} else if (userRanks[groupId] <= newRank) {
		return {error: {message: `Cannot rank to ${newRank}. Bot rank is ${userRanks[groupId]}.`}};
	} else {
		// it's ok. Attempt to rank.
		try {
            const s = await noblox.setRank(groupId, userId, newRank);
            if (s) {
							console.log(`Ranked user ${userId} to ${newRank} in ${groupId}.`);
						}
			return s;
		} catch (e) {
			console.error(e);
			return {error: {message: e.message}};
		}
	}

}
module.exports = {
	setRank: setRank
};
