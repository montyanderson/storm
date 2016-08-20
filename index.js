"use strict";
const express = require("express");
const helmet = require("helmet");
const config = require("./lib/config.js");

const app = express();

app.use(helmet());

app.use((req, res, next) => {
	res.set("X-Process", process.env.PROCESS);
	next();
});

if(!config.noStatic) {
	app.use(express.static(__dirname + "/static"));
}

app.get("/", ...require("./routes/index.js"));
app.get("/search", ...require("./routes/search.js"));
app.get("/generate", ...require("./routes/generate.js"));

app.listen(process.env.PORT || 8080);
