const View = require("./view.js");
const search = require("./search.js");

const sources = new View(`
	{{#sources}}
		{{type}} {{id}}
	{{/sources}}
`, (view) => {
	$(".sources").html(view);
});

const playlist = new View(`
	<iframe id="playlist" src="https://embed.spotify.com/?uri=spotify:trackset:Storm Playlist:{{{songs}}}" frameborder="0" allowtransparency="true" width=100% height=380></iframe>
`, (view) => {
	$(".playlist").html(view);
});

$("#search").keyup(() => {
	$.ajax({
		url: "/search",
		data: {q: $("#search").val()},
		success: (res) => {
			search.render({artists: JSON.parse(res)})
		}
	});
});

$("#generate").click(() => {
	$.ajax({
		url: "/generate",
		data: {q: JSON.stringify(sources.locals.sources)},
		success: (res) => {
			playlist.render({songs: JSON.parse(res).join(",")});
		}
	})
});
