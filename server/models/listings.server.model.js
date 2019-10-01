var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var listingSchema = new Schema({
  code: String,
  name: String,
  coordinates: {
    latitude: Number,
    longitude: Number,
  },
  address: String,
});

listingSchema.pre('save', function(next) {
  if (this.code && this.name) {
    return next();
  }
  else if (this.coordinates.latitude && this.coordinates.longitude && this.address) {
    return next();
  }
  else {
    return next(new Error("Error!"));
  }
});

var Listing = mongoose.model('Listing', listingSchema);
module.exports = Listing;