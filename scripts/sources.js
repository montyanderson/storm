const View = require("./view.js");

const playlist = require("./playlist.js");

const sources = module.exports = new View(`
	<button class="btn btn-orange col s12" id="generate">Make a storm...</button>

	<ul class="collection">
		{{#sources}}
		<li class="collection-item">{{#name}}{{name}}{{/name}}{{^name}}{{id}}{{/name}}</li>
		{{/sources}}
	</ul>
`, (view) => {
	$(".sources").html(view);

	$("#generate").click(() => {
		$.ajax({
			url: "/generate",
			data: {
				q: JSON.stringify(sources.locals.sources.map((card) => {
					return {type: card.type, id: card.id};
				}))
			},
			success: (res) => {
				playlist.render({songs: JSON.parse(res).join(",")});
			}
		});
	});
});
