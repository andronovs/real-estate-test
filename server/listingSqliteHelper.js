var fs = require("fs");
var path = require('path'); 
var Q = require('q'); 
var sqlite3 = require("sqlite3").verbose();
var _ = require('lodash'); 
var moment = require('moment'); 

var listing = require('./models/listing'); 

//-----------------------
var fileName = path.join(__dirname, "data", "realEstate.db"); 
var exists = fs.existsSync(fileName);

if (!exists) {
  console.log("Creating DB file...");
  fs.openSync(fileName, "w");

  _seedDatabase(); 
}

//-----------------------

function getListings() {

  var deferred = Q.defer();

  var listings = []; 
  _getListingRows(function(rows) {

    _.forEach(rows, function(row) {
      listings.push(new listing(row.id, row.address, row.askingPrice, row.numberOfBedrooms, row.dateListed, row.maxBid)); 
    }); 
  
    deferred.resolve(listings); 
  }); 

  return deferred.promise;   
}

function getListingById(id) {

  var deferred = Q.defer();

  _getListingRowById(id, function(rows) {

    var result; 
    if (rows.length > 0) {
      var row = rows[0]; 
      result = new listing(row.id, row.address, row.askingPrice, row.numberOfBedrooms, row.dateListed, row.maxBid); 
    } 
  
    deferred.resolve(result); 
  }); 

  return deferred.promise; 
}

function addListing(newListing) { 

  var deferred = Q.defer();

  _addListing(newListing, function() {

    deferred.resolve(newListing); 
  }); 

  return deferred.promise; 
}

function updateListing(listingId, existingListing) { 

  var deferred = Q.defer();

  _updateListing(listingId, existingListing, function() {

    deferred.resolve(existingListing); 
  }); 

  return deferred.promise; 
}

function deleteListingById(id) {

  var deferred = Q.defer();

  _deleteListingById(id, function() {

    deferred.resolve("done"); 
  }); 

  return deferred.promise;   
}

//-----------------------------------------

function _getListingRows(callback) { 

  var db = new sqlite3.Database(fileName);

  db.serialize(function() {
    db.all("SELECT rowid AS id, address, askingPrice, numberOfBedrooms, dateListed, maxBid FROM Listing", function(err, rows) {
      if (callback) {
        callback(rows); 
      }
    });
  });

  db.close();
}

function _getListingRowById(id, callback) { 

  var db = new sqlite3.Database(fileName);

  db.serialize(function() {
    var listings = []; 

    db.all("SELECT rowid AS id, address, askingPrice, numberOfBedrooms, dateListed, maxBid FROM Listing WHERE rowid = " + id, function(err, rows) {
      if (callback) {
        callback(rows); 
      }
    });
  });

  db.close();
}

function _addListing(newListing, callback) { 

  var db = new sqlite3.Database(fileName);

  db.serialize(function() {
    var stmt = db.prepare("INSERT INTO Listing VALUES (?, ?, ?, ?, ?)");

    stmt.run(newListing.address, newListing.askingPrice, newListing.numberOfBedrooms, moment(newListing.dateListed).format("DD-MM-YYYY HH:mm:ss"), newListing.maxBid); 

    stmt.finalize(function(err) {
      if (callback) {
        callback(); 
      }
    });
  });

  db.close();
}

function _updateListing(listingId, existingListing, callback) { 

  var db = new sqlite3.Database(fileName);

  db.serialize(function() {
    var stmt = db.prepare("UPDATE Listing SET address = ?, askingPrice = ?, numberOfBedrooms = ?, dateListed = ?, maxBid = ? WHERE rowid = ?");

    stmt.run(existingListing.address, existingListing.askingPrice, existingListing.numberOfBedrooms, 
            moment(existingListing.dateListed).format("DD-MM-YYYY HH:mm:ss"), existingListing.maxBid, listingId); 

    stmt.finalize(function(err) {
      if (callback) {
        callback(); 
      }
    });
  });

  db.close();
}

function _deleteListingById(id, callback) {
  var db = new sqlite3.Database(fileName);

  db.serialize(function() {
    var stmt = db.prepare("DELETE FROM Listing WHERE rowid = ?"); 

    stmt.run(id); 

    stmt.finalize(function(err) {
      if (callback) {
        callback(); 
      }
    });
  });

  db.close();
}

function _getDefaultListings() { 
  var dt = new Date(); 

  var listings = [
          new listing(1, "Address 1", 100000, 1, dt, 0), 
          new listing(2, "Address 2", 150000, 1, dt.setDate(dt.getDate() - 1), 0), 
          new listing(3, "Address 3", 200000, 2, dt.setDate(dt.getDate() - 2), 0), 
          new listing(4, "Address 4", 150000, 2, dt.setDate(dt.getDate() - 3), 0), 
          new listing(5, "Address 5", 300000, 3, dt.setDate(dt.getDate() - 4), 0)
          ]; 

  return listings; 
} 

function _seedDatabase() {
  var db = new sqlite3.Database(fileName);

  db.serialize(function() {
    if(!exists) {
      db.run("CREATE TABLE Listing (address TEXT, askingPrice REAL, numberOfBedrooms INTEGER, dateListed TEXT, maxBid REAL)");
    }
    
    // insert default data 
    var stmt = db.prepare("INSERT INTO Listing VALUES (?, ?, ?, ?, ?)");

    var listings = _getDefaultListings(); 
    _.forEach(listings, function(newListing) {
      stmt.run(newListing.address, newListing.askingPrice, newListing.numberOfBedrooms, moment(newListing.dateListed).format("DD-MM-YYYY HH:mm:ss"), newListing.maxBid); 
    }); 
    stmt.finalize();
  });

  db.close();
} 
//-----------------------------------------

module.exports = { 
    getListings: getListings, 
    getListingById: getListingById, 
    addListing: addListing,
    updateListing: updateListing,
    deleteListingById: deleteListingById 
}
