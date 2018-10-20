require("regenerator-runtime/runtime");

const mongoose = require("mongoose");
const tmdb = require("./tmdb");
mongoose.Promise = global.Promise;
const slug = require("slugs");

var Schema = mongoose.Schema;

//Movie
const movieSchema = new Schema({
  _id: { type: Schema.ObjectId, auto: true, select: true },
  movieAPIID: {
    type: String,
    alias: "movieID",
    select: false
  },
  title: {
    type: String,
    trim: true,
    required: "Must have movie title"
  },
  slug: String, //for browsing movie details directly
  language: String,
  leadActors: [String],
  rating: Number,
  duration: Number,
  tags: [String],
  synopsis: String,
  trailer: String,
  genres: [String],
  poster: String,
  backdrop: String,
  leadActors: [String],
  cast: [String],
  crew: {
    director: [String],
    musicDirector: [String]
  },
  created: {
    type: Date,
    default: Date.now,
    select: false
  },
  updated: {
    type: Date,
    default: Date.now,
    select: false
  },
  __v: { type: Number, select: false }
});

// // Define  indexes
// movieSchema.index({
//   title: "text"
// });

// movieSchema.index({ synopsis: "text" });

// function autopopulate(next) {
//   this.populate("title");
//   next();
// }
// movieSchema.pre("find", autopopulate);
// movieSchema.pre("findOne", autopopulate);

// Export the model
module.exports = mongoose.model("Movie", movieSchema);
