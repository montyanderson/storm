const View = require("./view.js");

const search = new View(`
	{{#artists}}
        <div class='card small' data-id="{{id}}" data-type='{{{type}}}'>
            <div class='card-image {{color}}'>
                <img src='{{image}}'>
                <span class='card-title'>{{name}}</span>
          </div>
                <div class='card-content'>
                    {{#data}}
                        <p>{{0}}: <span>{{1}}</span></p>
                    {{/data}}
              </div>
          </div>
	{{/artists}}
`, (view) => {
	$(".search-results").html(view);

	$(".search-results .card").click(function() {
		const card = $(this);

		sources.locals.sources = sources.locals.sources || [];

		const id = card.attr("data-id");
		const type = card.attr("data-type");

		if(sources.locals.sources.filter(a => a.id == id).length == 0) {
			sources.locals.sources.push({
				id, type
			});
		}

		sources.render();
	});
});

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
