const fs = require('fs');
const axios = require('axios');

// var promise = new Promise(function(resolve, reject) {
//   // make axios request
// });


var appRouter = function(app) {

  var validateKey = function(req, res) {    
    if (req.headers.api_key != process.env.API_KEY) {
      console.log(req.headers.api_key);
      res.status(401);
      res.send();
    }
  }

  var getAccessToken = function() {
    const url = `https://accounts.zoho.com/oauth/v2/token?refresh_token=${process.env.REFRESH_TOKEN}&client_id=${process.env.CLIENT_ID}&client_secret=${process.env.CLIENT_SECRET}&grant_type=refresh_token`;

    return axios.post(url);
  }


  app.get("/", function(req, res) {
    res.send("Hello World");
  });

  app.get('/leads', function(req,res) { 
    validateKey(req, res);

    var getLeads = function(token) {
      return axios.get('https://www.zohoapis.com/crm/v2/Leads', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
    }

    getAccessToken()
    .then(function (response) {
      const access_token = response.data.access_token;
      
      getLeads(access_token)
      .then(function (response) {
        console.log(response);
        res.json(response.data).status(200);       
      })
      .catch(function (error) {
        console.log(error);
        res.send(error.response.data.message);        
      });

    })
    .catch(function (error) {
      console.log(error);
      res.send(error.response.data.message);      
    });
    
  });

  app.patch('/inquiries/:id', function(req,res) {
    validateKey(req, res);

    var inquiryId = req.params.id;
    
    if (req.body.status) {
      if (req.body.status != "approved" && req.body.status != "declined") {
        res.send("error, status needs to be 'approved' or 'declined'.");
        return false;
      }
    }  

    var updateInquiry = function(token, id) {
      var config = {
        headers: {"Authorization": `Bearer ${token}`}
      }
      var requestBody = {data:[req.body]};
      return axios.put('https://www.zohoapis.com/crm/v2/Leads/'+id, requestBody, config);
    }

    getAccessToken()
    .then(function (response) {
      const access_token = response.data.access_token;

      updateInquiry(access_token, inquiryId)
      .then(function (response) {
        res.json(response.data).status(200);       
      })
      .catch(function (error) {
        res.status(500);
        console.log(error);
        res.send(error.response.data.message);
        
        // TODO: Learn how to parse/interpret errors
      });

    })
    .catch(function (error) {
      console.log(error);
      res.send(error.response.data.message).status(401);
    });

  });

}

module.exports = appRouter;