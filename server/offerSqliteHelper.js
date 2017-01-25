var fs = require("fs");
var path = require('path'); 
var Q = require('q'); 
var sqlite3 = require("sqlite3").verbose();
var _ = require('lodash'); 
var moment = require('moment'); 

var offerValidationResult = require('./models/offerValidationResult'); 

var fileName = path.join(__dirname, "data", "realEstate.db"); 


function validateOffer(id, amount) {

  var deferred = Q.defer();

  var listings = []; 
  _validateOffer(id, amount, function(offer) {
    console.log("validateOffer():", offer); 
    deferred.resolve(offer); 
  }); 

  return deferred.promise;   
}

//-----------------------------------------

function _validateOffer(id, amount, callback) { 

  var db = new sqlite3.Database(fileName);

  db.serialize(function() {
    db.all("SELECT maxBid FROM Listing WHERE rowid = " + id, function(err, rows) {

      var isAccepted = false; 
      var offer = new offerValidationResult(id, amount, isAccepted, "Not set"); 
      
      if (rows.length > 0) {
        var row = rows[0]; 

        var maxBid = row["maxBid"]; 

        isAccepted = amount > maxBid;         
        var status = isAccepted? "Accepted" : "Rejected"; 

        offer = new offerValidationResult(id, amount, isAccepted, status); 
      }

      // internally update the max offer amount for the current listing Id if the offer is accepted 
      if (isAccepted) {
        _updateOffer(id, amount, offer, callback); 
      }
      else if (callback) {
        callback(offer); 
      }
    });
  });

  db.close();
}

function _updateOffer(listingId, maxBid, offer, callback) { 

  var db = new sqlite3.Database(fileName);

  db.serialize(function() {
    var stmt = db.prepare("UPDATE Listing SET maxBid = ? WHERE rowid = ?");

    stmt.run(maxBid, listingId); 

    stmt.finalize(function(err) {
      if (callback) {
        callback(offer); 
      }
    });
  });

  db.close();
}

//-----------------------------------------

module.exports = { 
  validateOffer: validateOffer 
}
