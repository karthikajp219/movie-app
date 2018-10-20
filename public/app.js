"use strict";

// @gokuvinoth
// 03/Oct/2018 Initial Draft
// 07/Oct/2018 modified as per the comments to simply code
// to retrive the movie list from api and display in the app.html
//------ improments required to reuse functions in creating elements

// Calling the movie result api
//include("xmlhttprequest").XMLHttpRequest;

var xhr = new XMLHttpRequest();
xhr.responseType = "json";
xhr.onreadystatechange = function () {
  if (xhr.readyState === XMLHttpRequest.DONE) {
    console.log(xhr.response);
    // function call to process api result
    displayResult(xhr.response);
  }
};
// url to call api
xhr.open("GET", "https://salty-sea-40504.herokuapp.com/movies");
xhr.send();

var displayResult = function displayResult(response) {
  var responseDataArry = response;
  console.log(responseDataArry[0]);

  var movieElement = "";
  //   looping to create elements for number of items returned
  responseDataArry.forEach(function (responseData) {
    movieElement = movieElement + ("<div class=\"movie\">\n    <h2 class=\"movie-title\" id=\"movietitle\">" + responseData.title + "</h2>\n    <img class=\"movie-poster\" id=\"movieposter\" src=\"" + responseData.poster + "\" alt=\"hero and heroine\">\n    <ul class=\"movie-info\" id=\"movieinfo\">\n        <li class=\"movie-show-time\" id=movieshowtime><a class=\"movie-more-info\" id=\"moviemoreinfo\" href=\"#\">" + responseData.sessions[0].sessionDateTime[0] + "</a></li>\n        <li class=\"movie-language\" id=\"movielanguage\">" + responseData.language + "</li>\n    </ul>\n</div>");

    console.log(movieElement);
  });
  //   create final element and append to display the full content in HTML
  var resultElement = document.querySelector("#movies");
  resultElement.innerHTML = movieElement;
};