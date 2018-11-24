const fs = require('fs');

var appRouter = function(app) {

  app.get("/", function(req, res) {
      res.send("Hello World");
  });

  app.all('/pid', (req, res) => {
    res.end(`process ${process.pid} says hello!`);
  });

  app.get('/locations', (req,res) => {
    const data = fs.readFileSync('mocks/store-locator.json', 'utf8');
    const contents = JSON.parse(data);
    res.json(contents).status(200);
  });
}

module.exports = appRouter;