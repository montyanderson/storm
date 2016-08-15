"use strict";
const express = require("express");
const helmet = require("helmet");
const config = require("./lib/config.js");

const app = express();

app.use(helmet());

if(!config.noStatic) {
	app.use(express.static(__dirname + "/static"));
}

app.get("/search", ...require("./routes/search.js"));
app.get("/generate", ...require("./routes/generate.js"));

app.listen(process.env.PORT || 8080);
