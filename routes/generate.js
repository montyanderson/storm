const querystring = require("querystring");
const got = require("got");
const async = require("async");
const db = require("../lib/db.js");
const config = require("../lib/config.js");
const shuffle = require("../lib/shuffle.js");

module.exports = [
	(req, res, next) => { /* parse cards json */
		try {
			res.locals.cards = JSON.parse(req.query.q);
		} catch(err) {
			res.locals.cards = [];
		}

		res.locals.songs = [];
		next();
	},
	(req, res, next) => { /* get songs for artists from spotify */
		async.map(res.locals.cards.filter(a => a.type == "artist"), (artist, callback) => {
			got("https://api.spotify.com/v1/artists/" + artist.id + "/top-tracks?country=GB").then((response) => {
				const data = JSON.parse(response.body);

				callback(null, data.tracks.map(track => track.id));
			}).catch(callback);
		}, (err, artist) => {
			artist.forEach((artist) => {
				artist.forEach(song => res.locals.songs.push(song));
			});

			next();
		});
	},
	(req, res, next) => {
		shuffle(res.locals.songs);
		next();
	},
	(req, res, next) => {
		res.end(JSON.stringify(res.locals.songs));
	}
];
