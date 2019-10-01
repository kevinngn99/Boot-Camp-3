var mongoose = require('mongoose');
var Listing = require('../models/listings.server.model.js');
var config = config = require('../config/config.js');
var coordinates = require('./coordinates.server.controller.js');

mongoose.connect(config.db.uri, { useNewUrlParser: true });

exports.create = function(req, res) {
  var listing = new Listing(req.body);

  if (req.results) {
    listing.coordinates = {
      latitude: req.results.lat, 
      longitude: req.results.lng
    };
  }
 
  listing.save(function(err) {
    if (err) {
      res.status(400).send(err);
    } 
    else {
      res.json(listing);
    }
  });
};

exports.read = function(req, res) {
  res.json(req.listing);
};

exports.update = function(req, res) {
  var listing = req.listing;

  if (listing.name && listing.code && listing.address) {
    listing.name = req.body.name;
    listing.code = req.body.code;
    listing.address = req.body.address;

    if (listing.coordinates) {
      listing.coordinates = req.results;
    }
    
    listing.save(function(err) {
      if (err) {
        res.status(400).send(err);
      }
      else {
        res.json(listing);
      }
    });
  }
  else {
      res.status(400).send();
  }
};

exports.delete = function(req, res) {
  Listing.findByIdAndDelete(req.listing._id, function(err, listing) {
    if (err) {
      res.status(400).send(err);
    }
    else {
      res.json(listing);
    }
  });
};

exports.list = function(req, res) {
  Listing.find({}, function(err, listing) {
    if (err) {
      res.status(400).send(err);
    }
    else {
      res.json(listing);
    }
  });
};

/* 
  Middleware: find a listing by its ID, then pass it to the next request handler. 

  HINT: Find the listing using a mongoose query, 
        bind it to the request object as the property 'listing', 
        then finally call next
 */
exports.listingByID = function(req, res, next, id) {
  Listing.findById(id).exec(function(err, listing) {
    if (err) {
      res.status(400).send(err);
    }
    else {
      req.listing = listing;
      next();
    }
  });
};