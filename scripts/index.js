const Hogan = require("hogan.js");

const search = Hogan.compile(`
	{{#artists}}
        <div class='card small'>
            <div class='card-image {{color}} artist'>
                <img src='{{image}}'>
                <span class='card-title'>{{name}}</span>
          	</div>
        </div>
    {{/artists}}
`);

$("#search").keyup(() => {
	$.ajax({
		url: "/search",
		data: {q: $("#search").val()},
		success: (res) => {
			$(".search-results").html(search.render({
				artists: JSON.parse(res)
			}));
		}
	})
});
