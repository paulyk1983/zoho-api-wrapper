const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();


const app = express();
app.use(bodyParser.json({ extended: false }));
var routes = require("./routes/routes.js")(app);
const port = process.env.PORT || 1337;

app.listen(port);

console.log("Server running at http://localhost:%d", port);