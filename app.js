const express = require('express');

// const logger = require('./config/winston');
// Set up mongoose connection
// if (process.env.NODE_ENV !== 'production') {
//    eslint-disable global-require 
//   require('dotenv').load();
//   /* eslint-enable global-require */
// }
const app = express();
var routes = require("./routes/routes.js")(app);
const port = process.env.PORT || 1337;


// app.use(require('morgan')('combined', { stream: logger.stream }));


// app.use((err, req, res, next) => {
//   logger.error(`${err.status || 500} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);

//   res.status(err.status || 500);

//   res.render('error');
// });



app.listen(port);

console.log("Server running at http://localhost:%d", port);