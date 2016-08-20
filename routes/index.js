const fs = require("fs");
const Hogan = require("hogan.js");
const db = require("../lib/db.js");

const template = Hogan.compile(fs.readFileSync(__dirname + "/../index.mustache").toString());

module.exports = [
	(req, res, next) => { /* get amount of generated playlists */
		db.get("playlists", (err, playlists) => {
			res.locals.playlists = playlists;
			next();
		});
	},
	(req, res) => { /* serve rendered playlist */
		res.set("Content-Type", "text/html");
		res.end(template.render(res.locals));
	}
];
