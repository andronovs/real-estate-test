const path = require('path');
const express = require('express'); 
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');

const indexPath = path.join(__dirname, './index.html');
const port = (process.env.PORT || 8000);

const assetsPath = path.join(__dirname, './assets');
const publicAssetsPath = express.static(assetsPath); 
app.use('/assets', publicAssetsPath);

const buildPath = path.join(__dirname, './build');
const publicBuildPath = express.static(buildPath); 
app.use('/build', publicBuildPath);

app.get('/', function (_, res) { 
    res.sendFile(indexPath); 
});

app.use(cors()); 
app.use(bodyParser.json({limit: "5mb"}));                       // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json


app.get('/api/listings', function(req, res) {

    const sqlHelper = require('./server/listingSqliteHelper'); 
    sqlHelper.getListings()  
    .then(function(listings) { 
      console.log('web.js: GET api/listings: listings=', listings); 

      res.json(JSON.stringify(listings)); 
    }); 
  } 
); 

app.get('/api/listing/:listingId', function(req, res) {
  
    const listingId = Number(req.params.listingId);

    const sqlHelper = require('./server/listingSqliteHelper'); 
    sqlHelper.getListingById(listingId)  
    .then(function(result) { 
      console.log('web.js: GET: api/listing/:listingId result=', result); 

      res.json(JSON.stringify(result)); 
    }); 
  } 
); 

app.post('/api/listing', function(req, res) {
  
    console.log('web.js: POST api/listing', req.body); 

    if (req.body && req.body.listing) {
      const listing = JSON.parse(req.body.listing); 

      const sqlHelper = require('./server/listingSqliteHelper'); 
      sqlHelper.addListing(listing) 
      .then(function(result) { 
        console.log("web.js: POST: result=", result); 
        
        res.status(200).end(); 
      }); 
    } 
  }  
); 

app.put('/api/listing/:listingId', function(req, res) {
  
    var listingId = Number(req.params.listingId);
    console.log('PUT api/listing', listingId, req.body); 

    if (req.body && req.body.listing) {
      const listing = JSON.parse(req.body.listing); 

      const sqlHelper = require('./server/listingSqliteHelper'); 
      sqlHelper.updateListing(listingId, listing) 
      .then(function(result) { 
        console.log('web.js: PUT: api/listing/:listingId result=', result); 
        
        res.status(200).end(); 
      }); 
    } 
  }  
); 

app.delete('/api/listing/:listingId', function(req, res) {
  
    const listingId = Number(req.params.listingId);

    const sqlHelper = require('./server/listingSqliteHelper'); 
    sqlHelper.deleteListingById(listingId)  
    .then(function(result) { 
      console.log('web.js: DELETE: api/listing/:listingId result=', result); 
      
      res.status(200).end(); 
    }); 
  } 
); 

app.post('/api/offer', function(req, res) {
  
    console.log('web.js: POST api/offer', req.body); 

    if (req.body && req.body.listingId && req.body.amount) {
      const listingId = req.body.listingId; 
      const amount = req.body.amount; 

      console.log('web.js: POST api/offer', listingId, amount); 

      const sqlHelper = require('./server/offerSqliteHelper'); 
      
      sqlHelper.validateOffer(listingId, amount) 
      .then(function(offerValidationResult) { 
        console.log("web.js: POST: offerValidationResult=", offerValidationResult); 
        
        res.json(JSON.stringify(offerValidationResult)); 
      }); 
    } 
  }  
); 

var server = app.listen(port, function() {
  console.log('Listening at http://localhost:' + port); 
}); 

