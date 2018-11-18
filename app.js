const express = require('express');

const logger = require('./config/winston');
// Set up mongoose connection
if (process.env.NODE_ENV !== 'production') {
  /* eslint-disable global-require */
  require('dotenv').load();
  /* eslint-enable global-require */
}
const app = express();
const processport = process.env.PORT;


app.use(require('morgan')('combined', { stream: logger.stream }));


app.use((err, req, res, next) => {
  logger.error(`${err.status || 500} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);

  res.status(err.status || 500);

  res.render('error');
});

var routes = require("./routes/routes.js")(app);

app.listen(processport, () => {
  logger.info(`Process up at port ${processport}`);
});