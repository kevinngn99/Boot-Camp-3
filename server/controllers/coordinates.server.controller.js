var config = require('../config/config');
var request = require('request');

module.exports = function(req, res, next) {
  if(req.body.address) {
      var addressTemp = req.body.address;
      var addressTemp2 = addressTemp.toLowerCase();
      var addressTemp3 = addressTemp2.replace(/\s/g, "%20");
      var addressTemp4 = addressTemp3.replace(/,/g , "%2C");
      
    var options = { 
      q: addressTemp4,
      key: config.openCage.key,  
    }

    request({url: 'https://api.opencagedata.com/geocode/v1/json', qs: options}, function(error, response, body) {
      if (error) {
        response.status(400).send(err);
      }
      else {
        var object = JSON.parse(body).results;
        var geometry = object[0].geometry;
        var lat = geometry['lat'];
        var long = geometry['lng'];
        var coords = {
          lat: lat,
          lng: long
        }
        req.results = coords;
        next();
      }
    });
  }
  else {
    next();
  }
};  