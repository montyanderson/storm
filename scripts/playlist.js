const View = require("./view.js");

const playlist = module.exports = new View(`
	<div class="row">
		<a href="spotify:trackset:Playlist:{{{songs}}}">Open in Spotify</a>

		<iframe class="col s12" src="https://embed.spotify.com/?uri=spotify:trackset:Storm Playlist:{{{songs}}}" frameborder="0" height=500 allowtransparency="true"></iframe>
	</div>
`, (view) => {
	$(".playlist").html(view);
});
