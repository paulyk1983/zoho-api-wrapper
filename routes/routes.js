const fs = require('fs');
const axios = require('axios');

var appRouter = function(app) {

  app.get("/", function(req, res) {
      res.send("Hello World");
  });

  // app.all('/pid', (req, res) => {
  //   res.end(`process ${process.pid} says hello!`);
  // });

  app.get('/locations', function(req,res) {
    const data = fs.readFileSync('mocks/store-locator.json', 'utf8');
    const contents = JSON.parse(data);
    res.json(contents).status(200);
  });

  app.get('/leads', function(res,req) {
    // get access token
    axios.post(`https://accounts.zoho.com/oauth/v2/token?refresh_token=${process.env.REFRESH_TOKEN}&client_id=${process.env.CLIENT_ID}&client_secret=${process.env.CLIENT_SECRET}&grant_type=refresh_token`)
    .then(function (response) {
      const access_token = response.data.access_token;
      
      // get leads
      axios.get('https://www.zohoapis.com/crm/v2/Leads', {
        headers: {
          Authorization: `Bearer ${access_token}`
        }
      })
      .then(function (response) {
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      });

    })
    .catch(function (error) {
      console.log(error);
    });

  });
}

module.exports = appRouter;