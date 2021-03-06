const axios = require('axios');

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

  app.use(function(req, res, next) {

    // FOR CORS POLICY
    res.header("Access-Control-Allow-Origin", "https://finishlinecorp.com");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, api_key");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE");
    next();
  });

  app.get("/", function(req, res) {
    res.send("Hello World");
  });

  app.patch('/inquiries/:id', function(req,res) {
    validateKey(req, res);

    var inquiryId = req.params.id;
    
    if (req.body.Status) {
      if (req.body.Status != "approved" && req.body.Status != "declined") {
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
        console.log(error);
        res.status(500);        
        res.send(error.response.data.message);        
      });

    })
    .catch(function (error) {
      console.log(error);
      res.send(error.response.data.message).status(401);
    });

  });

  // Process Samples from /samples page -> Adds sample data to Potential 'sample info' field
  app.patch('/potentials/:id', function(req,res) {
    validateKey(req, res);

    var potentialId = req.params.id;

    var updatePotential = function(token, id) {
      var config = {
        headers: {"Authorization": `Bearer ${token}`}
      }
      var requestBody = {data:[req.body]};

      return axios.put('https://www.zohoapis.com/crm/v2/Potentials/'+id, requestBody, config);
    }

    getAccessToken()
    .then(function (response) {
      const access_token = response.data.access_token;

      updatePotential(access_token, potentialId)
      .then(function (response) {
        res.json(response.data).status(200);       
      })
      .catch(function (error) {
        console.log(error);
        res.status(500);        
        res.send(error.response.data.message);        
      });

    })
    .catch(function (error) {
      console.log(error);
      res.send(error.response.data.message).status(401);
    });

  });

  app.get('/products', function(req,res) {
    validateKey(req, res);

    var getProducts = function(token) {
      return axios.get('https://www.zohoapis.com/crm/v2/Products', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
    }

    getAccessToken()
    .then(function (response) {
      const access_token = response.data.access_token;
      
      getProducts(access_token)
      .then(function (response) {

        // Sort product resources by product name
        function compareProductNames(a, b) {
          const nameA = a.Product_Name;
          const nameB = b.Product_Name;
        
          let comparison = 0;
          if (nameA > nameB) {
            comparison = 1;
          } else if (nameA < nameB) {
            comparison = -1;
          }
          return comparison;
        }
        response.data.data.sort(compareProductNames);

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

  // Will not add product if duplicate name. Instead, it will update existing product.
  app.post('/products', function(req,res) {
    validateKey(req, res);

    var addProduct = function(token) {
      var config = {
        headers: {"Authorization": `Bearer ${token}`}
      }
      var requestBody = {data:[req.body]};

      return axios.post('https://www.zohoapis.com/crm/v2/Products/upsert', requestBody, config);
    }

    getAccessToken()
    .then(function (response) {
      const access_token = response.data.access_token;

      addProduct(access_token)
      .then(function (response) {
        res.json(response.data).status(200);      
      })
      .catch(function (error) {
        res.status(500);
        res.send(error);     
      });

    })
    .catch(function (error) {
      console.log(error);
      res.status(401);
      res.send(error);      
    });
  });

}

module.exports = appRouter;