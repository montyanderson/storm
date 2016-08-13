"use strict";
const express = require("express");
const app = express();

app.use(express.static(__dirname + "/static"));

app.get("/search", ...require("./routes/search.js"));
app.get("/generate", ...require("./routes/generate.js"));

app.listen(8080);
