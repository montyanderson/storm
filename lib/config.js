const argv = require("yargs")
	.usage("Usage: $0 --lastfm [lastfm api key] --spotify [spotify api key]")
	.demand(["lastfm", "spotify"])
	.describe("lastfm", "Last.fm api key")
	.describe("spotify", "Spotify api key")
	.describe("noStatic", "Only serve api endpoints")
	.argv;

const config = module.exports;

Object.assign(config, argv);
