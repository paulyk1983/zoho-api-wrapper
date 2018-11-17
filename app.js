const express = require('express');
const fs = require('fs');

const logger = require('./config/winston');
// Set up mongoose connection
if (process.env.NODE_ENV !== 'production') {
  /* eslint-disable global-require */
  require('dotenv').load();
  /* eslint-enable global-require */
}
const app = express();
const processport = process.env.PORT;
const cache = apicache.middleware;


app.use(require('morgan')('combined', { stream: logger.stream }));


app.use((err, req, res, next) => {
  logger.error(`${err.status || 500} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);

  res.status(err.status || 500);

  res.render('error');
});

app.listen(processport, () => {
  logger.info(`Process up at port ${processport}`);
});

app.all('/pid', (req, res) => {
  res.end(`process ${process.pid} says hello!`);
});



app.get('/locations', (req,res) => {
  const data = fs.readFileSync('mocks/store-locator.json', 'utf8');
  const contents = JSON.parse(data);
  res.json(contents).status(200);
});