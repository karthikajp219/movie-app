import { isArray } from "util";

//import { Movie } from "./movie.model";
var Movie = require("./movie.model");
var Session = require("./session.model");
var Cinema = require("./cinema.model");
var bodyParser = require("body-parser");
var tmdb = require("./tmdb");

//Returns all movies irrespective of active sessions
export async function getAllMovies(req, res) {
  // .select("+updated"); to included an excluded field

  const _limit = Number(req.query.limit) || 10;
  const _skip = _limit * Number(req.query.skip) || 0;

  try {
    let movies = await Movie.find()
      .limit(_limit)
      .skip(_skip);

    //TO DO: add some sort capability to increase relevance
    handleResponse({
      reponse: res,
      status: "success",
      content: movies
    });
  } catch (error) {
    handleResponse({
      reponse: res,
      status: "error",
      message: error.message
    });
  }
}

// TODO: determine how to determine whats and active session
//Returns all movies with only active sessions
export async function getMoviesWithActiveSessions(req, res) {
  // .select("+updated"); to included an excluded field

  const _limit = Number(req.query.limit) || 10;
  const _skip = _limit * Number(req.query.skip) || 0;

  var movieSessions = [];
  try {
    //refactor to return on movies with live sessions
    let movies = await Movie.find()
      .limit(_limit)
      .skip(_skip);

    //async for (const movie of movies){}

    for (const movie of movies) {
      const sessions = await Session.find({ movie: movie._id }).populate(
        "cinema"
      );

      var {
        _id,
        title,
        language,
        rating,
        tags,
        genres,
        poster,
        trailer,
        duration,
        synopsis,
        crew,
        leadActors,
        cast,
        slug
      } = movie;
      const movieSession = {
        _id,
        title,
        language,
        rating,
        duration,
        sessions,
        tags,
        genres,
        poster,
        trailer,
        synopsis,
        crew,
        leadActors,
        cast,
        slug
      };
      movieSessions.push(movieSession);
    }

    handleResponse({
      reponse: res,
      status: "success",
      content: movieSessions
    });
  } catch (error) {
    console.log("error");
    handleResponse({
      reponse: res,
      status: "error",
      message: error.message
    });
  }
}

//Add one or more movies based on name/s passed in the request body
export function createMovieByName(req, res) {
  let movieNames = req.body.movieNames;
  //If one movie is passed a string turn it into an array
  movieNames = isArray(movieNames) ? movieNames : [movieNames];

  let promises = [];
  movieNames.forEach(movieName => {
    promises.push(
      Promise.resolve(async () => {
        let dbMovie = await tmdb.retrieveMovie({ movieName: movieName });
        let modelMovie = new Movie({});
        Object.assign(modelMovie, dbMovie);

        await modelMovie.save();
        return modelMovie;
      })
    );
  });

  Promise.all(promises)
    .then(movies => {
      console.log(`Succesfully created movie/s ${movieNames.join()}`);

      console.log(movies[0].title);
      handleResponse({
        reponse: res,
        status: "success",
        message: `Succesfully created movie/s ${movieNames.join()}`,
        contentx: movies
      });
    })
    .catch(err => {
      console.log(
        `Error creating movie/s  : ${movieNames.join()} Error :  ${err}`
      );
      handleResponse({
        reponse: res,
        status: "error",
        message: `Error creating movie/s ${movieNames.join()} in database`
      });
    });
}

function handleResponse({ reponse, status, message = "", content = [] }) {
  console.log(content);
  //http Status
  let httpStatus = status == "success" ? 200 : 500;

  //Set override message if no message passed
  if (!message) {
    if (status == "success") {
      message =
        content.length > 0
          ? "Successfully retrieved movies"
          : "No movies available for the specified criteria";
    } else if (status == "error") {
      message = "Failure occured in retrieving movies";
    }
  }
  const _status = { status, message };
  const obj = { status: _status, content };
  reponse.status(httpStatus).json(obj);
}
