"use strict";
const querystring = require("querystring");
const express = require("express");
const redis = require("redis");
const got = require("got");

const app = express();
const db = redis.createClient();

app.use(express.static(__dirname + "/static"));

app.get("/search", function(req, res) {
	const q = req.query.q;

	db.get("search:" + q, (err, data) => {
		if(data) return res.end(data);

		const client_id = "f946296624e1496f9a1f6310973c744b";

		got("https://api.spotify.com/v1/search?" + querystring.stringify({
			client_id, q,
			type: "artist"
		})).then((response) => {
			const artists = JSON.parse(response.body).artists.items.map((a) => {
				const b = {
					name: a.name,
					id: a.id,
					genres: a.genres
				};

				if(a.images[0]) b.image = a.images[0].url;

				return b;
			});

			const data = JSON.stringify(artists);

			db.multi()
				.set("search:" + q, data)
				.expire("search:" + q, 60 * 60 * 1)
				.exec(() => {
						res.end(data);
			});
		}).catch((error) => {
			console.log(error);
			res.end();
		});
	});
});

app.listen(8080);
