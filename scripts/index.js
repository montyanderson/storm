const Hogan = require("hogan.js");

const search = Hogan.compile(`
	{{#artists}}
        <div class='card small'>
            <div class='card-image {{color}} artist'>
                <img src='{{image}}'>
                <span class='card-title grey-text'>{{name}}</span>
          	</div>

			<div class="row">
				{{#genres}}
					<a href="#" class="btn">{{.}}</a>
				{{/genres}}
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
