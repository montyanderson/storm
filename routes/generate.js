const querystring = require("querystring");
const got = require("got");
const async = require("async");
const db = require("../lib/db.js");
const config = require("../lib/config.js");
const shuffle = require("../lib/shuffle.js");

module.exports = [
	(req, res, next) => { /* parse cards json */
		res.locals.start = new Date();

		try {
			res.locals.cards = JSON.parse(req.query.q);
		} catch(err) {
			res.locals.cards = [];
		}

		res.locals.tracks = [];
		res.locals.lastfmTracks = [];;
		next();
	},
	(req, res, next) => { /* get tracks for artists from spotify */
		async.map(res.locals.cards.filter(a => a.type == "artist"), (artist, callback) => {
			got("https://api.spotify.com/v1/artists/" + escape(artist.id) + "/top-tracks?country=GB").then((response) => {
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
	(req, res, next) => { /* gets top tracks for a tag  */
		async.each(res.locals.cards.filter(a => a.type == "tag"), (tag, callback) => {
			got("https://ws.audioscrobbler.com/2.0/?" + querystring.stringify({
				api_key: config.lastfm,
				tag: tag.id,
				method: "tag.gettoptracks",
				format: "json"
			})).then((response) => {
				const tracks = JSON.parse(response.body).tracks.track.slice(0, 10);

				shuffle(tracks);

				tracks.slice(0, 6).filter(t => !!t).forEach((track) => {
					res.locals.lastfmTracks.push({
						name: track.name,
						artist: track.artist.name
					});
				});

				callback();
			}).catch(callback);
		}, next);
	},
	(req, res, next) => { /* resolve last.fm tracks */
		async.map(res.locals.lastfmTracks, (track, callback) => {
			const q = (track.name + " " + track.artist).trim().toLowerCase();
			const key = "track:" + q;

			db.get(key, (err, id) => {
				if(id) {
					console.log("from cache : )");
					return callback(null, id);
				}

				got("https://api.spotify.com/v1/search?" + querystring.stringify({
					q, type: "track"
				})).then((response) => {
					console.log("from api : )");
					const id = JSON.parse(response.body).tracks.items[0].id;
					db.multi()
						.set(key, id)
						.expire(key, 60 * 60 * 24 * 7)
						.exec(() => {
							callback(null, id);
					});
				}).catch(callback);
			});
		}, (err, tracks) => {
			res.locals.tracks.push(...tracks);
			next();
		});
	},
	(req, res, next) => { /* randomly shuffle array */
		res.locals.tracks.sort((a, b) => Math.round(Math.random()) * 2 - 1);
		next();
	},
	(req, res, next) => { /* serve tracks */
		db.incr("playlists", () => {
			res.end(JSON.stringify(res.locals.tracks));
		});
	}
];
