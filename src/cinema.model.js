const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const Schema = mongoose.Schema;

//Cinemas
let cinemaSchema = new Schema({
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
    default: Date.now,
    select: false
  },
  Updated: {
    type: Date,
    default: Date.now,
    select: false
  },
  __v: { type: Number, select: false }
});

// Export the model
module.exports = mongoose.model("Cinema", cinemaSchema);
