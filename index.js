"use strict";
const express = require("express");
const app = express();

app.use(express.static(__dirname + "/static"));

app.get("/search", require("./routes/search.js"));

app.listen(8080);
