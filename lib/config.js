module.exports = require("yargs")
	.usage("Usage: $0 --lastfm [lastfm api key] --spotify [spotify api key]")
	.demand(["lastfm", "spotify"])
	.argv;
