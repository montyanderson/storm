const querystring = require("querystring");
const got = require("got");
const db = require("../lib/db.js");
const config = require("../lib/config.js");

module.exports = [
	(req, res, next) => { /* return empty array is query is empty */
		if(!req.query.q || req.query.q.length < 1) return res.end("[]");
		next();
	},
	(req, res, next) => { /* attempt to get cached results from redis */
		db.get("search:" + req.query.q, (err, data) => {
			if(data) return res.end(data);
			next();
		});
	},
	(req, res, next) => {
		res.locals.results = [];
		next();
	},
	(req, res, next) => { /* get artists from spotify */
		got("https://api.spotify.com/v1/search?" + querystring.stringify({
			client_id: config.spotify,
			q: req.query.q,
			type: "artist"
		})).then((response) => {
			JSON.parse(response.body).artists.items.map((a) => {
				const b = {
					name: a.name,
					id: a.id,
					genres: a.genres,
					type: "artist"
				};

				if(a.images[0]) b.image = a.images[0].url;

				return b;
			}).forEach(a => res.locals.results.push(a));

			next();
		}).catch(next);
	},
	(req, res, next) => { /* pull tag data from lastfm */
		got("http://ws.audioscrobbler.com/2.0?" + querystring.stringify({
			api_key: config.lastfm,
			method: "tag.getInfo",
			tag: req.query.q,
			format: "json"
		})).then((response) => {
			const t = JSON.parse(response.body).tag;

			res.locals.results.unshift({
				name: t.name,
				id: t.name,
				type: "tag",
				songs: t.total,
				description: t.wiki.summary
			});

			next();
		}).catch(next);
	},
	(req, res, next) => { /* turn results into json */
		res.locals.data = JSON.stringify(res.locals.results);
		next();
	},
	(req, res, next) => { /* cache results in redis */
		if(!res.locals.data || res.locals.data.length < 1) return next();

		db.multi()
			.set("search:" + req.query.q, res.locals.data)
			.expire("search:" + req.query.q, 60 * 60 * 1)
			.exec(() => {
				next();
			});
	},
	(req, res) => {
		res.end(res.locals.data);
	}
];
