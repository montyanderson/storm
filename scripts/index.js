const View = require("./view.js");
const search = require("./views/search.js");
const sources = require("./views/sources.js");

$("#search").keyup(() => {
	$.ajax({
		url: "/search",
		data: {q: $("#search").val()},
		success: (res) => {
			search.render({artists: JSON.parse(res)});
		}
	});
});
