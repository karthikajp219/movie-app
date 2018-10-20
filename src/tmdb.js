//@Theepan Thevathasan
//11Oct 2018
//Retrives movies from TMDB
require("isomorphic-fetch");
var ISOLanguages = require("iso-639-3");

//Helper method
function stripTrailingCommas(_string) {
  return _string.replace(/,\s*$/, "");
}

//API Access Key for themoviedb.org
let movieAPIKey = "5066229b476a9c157a74692454f7661e";

//Consturcts the URL to fetch MovieID from themoviedb.org
function getMovieIDURL(_apiKey, _movieName) {
  let searchURL = `https://api.themoviedb.org/3/search/movie?api_key=[API_KEY]&query=[MOVIE_NAME]&page=1&include_adult=true`;
  searchURL = searchURL
    .split("[API_KEY]")
    .join(_apiKey)
    .split("[MOVIE_NAME]")
    .join(_movieName);
  return searchURL;
}
//get movieID from themoviedb.org
//Used to get all other movie details
function getMovieID(_apiKey, _movieName) {
  //Construct movie lookup URL
  if (!_apiKey) throw Error(`Valid APIKey must be passed : ${_apiKey}`);
  if (!_movieName) throw Error(`Movie name must be passed : ${_movieName}`);

  let searchURL = getMovieIDURL(_apiKey, _movieName);

  return new Promise((resolve, reject) => {
    fetch(searchURL)
      .then(res => {
        res
          .json()
          .then(data => {
            //If the movie array is empty search wasnt succesful
            if (data.results.length < 0)
              reject(
                Error(
                  `Lookup for movie name ${movieName} didn't return results`
                )
              );
            //retrieve movie with highest relevance
            var { id: movieID } = data.results[0];

            resolve(movieID);
          })
          .catch(err => reject(err));
      })
      .catch(err => reject(err));
  });
}

//Consturcts the URL to fetch Movie Details
function getMoviesDetailsURL(_apiKey, _movieID, _movieProperties = []) {
  let movieDetailsURL = `https://api.themoviedb.org/3/movie/[MOVIE_ID]?api_key=[API_KEY]&append_to_response=[MOVIE_PROPERTIES]`; //videos,images OR videos OR images
  movieDetailsURL = movieDetailsURL
    .split("[API_KEY]")
    .join(_apiKey)
    .split("[MOVIE_ID]")
    .join(_movieID);

  //Compose append_to_response from  MovieProperties array
  if (_movieProperties.length > 0) {
    movieDetailsURL = movieDetailsURL
      .split("[MOVIE_PROPERTIES]")
      .join(_movieProperties.join(","));
  }
  return movieDetailsURL;
}

//get all details of the movie using getMovieID()
function getMovieDetails(
  _apiKey = movieAPIKey,
  _movieID,
  _movieProperties = []
) {
  if (!_apiKey) throw Error(`Valid APIKey must be passed : ${_apiKey}`);
  if (!_movieID) throw Error(`A valid movieID must be passed : ${_movieID}`);

  let movieDetailsURL = getMoviesDetailsURL(
    _apiKey,
    _movieID,
    _movieProperties
  );

  return new Promise((resolve, reject) => {
    fetch(movieDetailsURL)
      .then(res => {
        res
          .json()
          .then(movieResults => {
            //If the movie array is empty search wasnt succesful
            if (!movieResults)
              reject(
                Error(`Lookup for movie name ${movieID} didn't return results`)
              );
            //retrieve movie with highest relevance
            var {
              id: movieID,
              title,
              spoken_languages: [{ name: language }],
              overview: synopsis,
              videos: {
                results: [video]
              },
              images: { posters },
              genres,
              rating,
              credits: { cast: castObjList },
              credits: { crew: crewObjList }
            } = movieResults;
            console.log(movieResults);

            //Extract the first poster meeting the width criterion
            let posterURL = null;
            let atLeastOnePoster = false;
            const maxPosterHeight = 1080;
            posters.forEach(poster => {
              atLeastOnePoster = true;
              if (poster.height <= maxPosterHeight) {
                posterURL = getMoviePosterURL(
                  poster.file_path.split("/").join(""),
                  500
                );
                return;
              }
            });
            //pop the first poster in of there no posters smaller than maxPosterHeight but there are still some big posters
            if (atLeastOnePoster && posters.length > 0) {
              posterURL = getMoviePosterURL(
                posters[0].file_path.split("/").join(""),
                500
              );
            }

            //Stringfy the Generes
            let genresArray = [];
            genres.forEach(genre => {
              genresArray.push(genre.name);
            });

            //Extract details of actors
            let leadActorsArray = [];
            let castArray = [];
            castObjList.forEach((castObj, index) => {
              castArray.push(castObj.name);
              //add only top 4 actors as lead actors
              if (castObjList.length >= 4 && index < 4) {
                leadActorsArray.push(castObj.name);
              }
            });

            var crew = { director: [], musicDirector: [] };

            //Identify crew
            crewObjList.forEach((_crew, index) => {
              switch (_crew.job) {
                case "Director":
                  crew.director.push(_crew.name);
                  break;
                case "Original Music Composer":
                  crew.musicDirector.push(_crew.name);
                  break;
              }
            });


            //compose a partial movice object
            var movie = {
              movieID,
              title,
                ///convert iso_639_1 code into full form language description
              language: ISOLanguages.find(
                _language =>
                  _language.iso6391 == movieResults.spoken_languages[0].iso_639_1
              ).name,
              synopsis,
              rating,
              trailer: "",
              rating : 5,
              duration : 210,
              poster: posterURL,
              genres: genresArray,
              cast: castArray,
              leadActors: leadActorsArray,
              crew
            };

            //resolve trailer link -- "Cleaner way to do this ?"
            if (!(video === undefined) && !(video.site === undefined))
              if (video.site == "YouTube") {
                movie.trailer = `https://www.youtube.com/watch?v=${video.key}`;
              } else {
                movie.trailer = `Site : ${video.site}  Video Key: ${video.key}`;
              }
            resolve(movie);
          })
          .catch(err => reject(err));
      })
      .catch(err => reject(err));
  });
}

//Construct movie poster URL
function getMoviePosterURL(_posterFile, _width) {
  if (!_width) throw Error(`Poster width must be specified : ${_width}`);
  if (!_posterFile)
    throw Error(`Poster file name must be specified : ${_posterFile}`);

  let posterURL = `https://image.tmdb.org/t/p/w[IMAGE_WIDTH]/[IMAGE_FILE_NAME]`;
  return posterURL
    .split("[IMAGE_WIDTH]")
    .join(_width)
    .split("[IMAGE_FILE_NAME]")
    .join(_posterFile);
}

//Retieve moive detals with helper functions
function retrieveMovie({
  apiKey = movieAPIKey,
  movieName,
  properties = ["videos", "images", "credits"]
}) {
  return new Promise((resolve, reject) => {
    getMovieID(apiKey, movieName)
      .then(movieid => {
        getMovieDetails(movieAPIKey, movieid, properties)
          .then(movie => {
            resolve(movie); // resolve promise with all movie details
          })
          .catch(err => {
            reject(
              `Error: Unable to retrieve Movie Details for ${movieName} with ID ${movieid} ${err}`
            );
          }); //getMovieDetails().catch()
      })
      .catch(err => {
        reject(`Error: Unable to retrieve Movie ID  for movie ${movieName}`);
      }); //getMovieID().catch()
  }); //return new Promise()
}

export { retrieveMovie };

//TEST MODULE
//let testMovies = ["Kadaikutty Singam", "chekka chivantha vaanam", "venom", "minnale", "titanic", "Kaakha Kaakha", "cinderella"];
// ["videos", "images", "credits"]
// let testMovies = ["Kadaikutty Singam"]
// testMovies.forEach(movieitem => {
//   retrieveMovie( {movieName : movieitem}).then(
//     movie => {
//       // console.log(JSON.parse(JSON.stringify(movie, null, "")));
//       console.log(JSON.stringify(movie, null, 2));
//       //movie.json().then(jsonString => console.log(jsonString));
//     }
//   );
// });
