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

		res.locals.tracks = [];
		next();
	},
	(req, res, next) => { /* get tracks for artists from spotify */
		async.map(res.locals.cards.filter(a => a.type == "artist"), (artist, callback) => {
			got("https://api.spotify.com/v1/artists/" + artist.id + "/top-tracks?country=GB").then((response) => {
				const data = JSON.parse(response.body);

				callback(null, data.tracks.map(track => track.id));
			}).catch(callback);
		}, (err, artist) => {
			artist.forEach((artist) => {
				artist.forEach(song => res.locals.tracks.push(song));
			});

			next();
		});
	},
	(req, res, next) => { /* gets top tracks for a tag then search for them on spotify */
		async.map(res.locals.cards.filter(a => a.type == "tag"), (tag, callback) => {
			got("https://ws.audioscrobbler.com/2.0/?" + querystring.stringify({
				api_key: config.lastfm,
				tag: tag.id,
				method: "tag.gettoptracks",
				format: "json"
			})).then((response) => {
				async.map(JSON.parse(response.body).tracks.track.slice(0, 6), (track, callback) => {
					got("https://api.spotify.com/v1/search?" + querystring.stringify({
						q: track.name + " " + track.artist.name,
						type: "track"
					})).then((response) => {
						callback(null, JSON.parse(response.body).tracks.items[0].id);
					}).catch(callback);
				}, callback);
			}).catch(callback);
		}, (err, tags) => {
			tags.forEach(tag => res.locals.tracks.push(...tag));
			next();
		});
	},
	(req, res, next) => { /* randomly shuffle array */
		shuffle(res.locals.tracks);
		next();
	},
	(req, res, next) => { /* serve tracks */
		res.end(JSON.stringify(res.locals.tracks));
	}
];
