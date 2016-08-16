const View = require("./view.js");

const playlist = require("./playlist.js");

const sources = module.exports = new View(`
	<button class="btn btn-orange col s12" id="generate">Make a storm...</button>

	<ul class="collection">
		{{#sources}}
		<li class="collection-item">{{name}}{{^name}}{{id}}{{/name}}<a href="#!" class="secondary-content"><i class="material-icons delete" data-id="{{id}}">delete</i></a></li>
		{{/sources}}
	</ul>
`, (view) => {
	$(".sources").html(view);

	$(".sources .delete").click(function() {
		const id = $(this).data("id");
		sources.locals.sources = sources.locals.sources.filter(a => a.id != id);
		sources.render();
	});

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
