"use strict";

var mongoose = require("mongoose");
mongoose.Promise = global.Promise;

var Schema = mongoose.Schema;

//Cinemas
var cinemaSchema = new Schema({
  _id: { type: Schema.ObjectId, auto: true },
  name: {
    type: String,
    trim: true,
    required: "Cinema should have a name"
  },
  state: {
    type: String,
    trim: true,
    uppercase: true,
    minlength: 2,
    maxlength: 3,
    required: "Cinema should have a state"
  },
  location: String,
  website: String,

  created: {
    type: Date,
    default: Date.now
  },
  Update: {
    type: Date,
    default: Date.now
  }
});

// Export the model
module.exports = mongoose.model("Cinema", cinemaSchema);