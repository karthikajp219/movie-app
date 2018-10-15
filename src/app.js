// @gokuvinoth
//   create final element and append to display the full content in HTML
let resultElement = document.querySelector("#movies");
let APIData = [];

// Calling the movie result api

const xhr = new XMLHttpRequest();
xhr.responseType = "json";
xhr.onreadystatechange = () => {
  if (xhr.readyState === XMLHttpRequest.DONE) {
    APIData = xhr.response;
    // function call to process api result
    displayListView(APIData);
  }
};
// url to call api
xhr.open("GET", "https://vast-basin-71998.herokuapp.com/movie");
xhr.send();

// mapping response to respective HTML elements
renderHtml = responseData => {
  return `<div class="movie">
    <h2 class="movie-title" id=${chkNull(
      responseData._id,
      "To be Named"
    )}>${chkNull(responseData.title, "To be Named")}</h2>
    <img class="movie-poster" id=${chkNull(
      responseData._id,
      "To be Named"
    )} src="${responseData.poster}" alt=${chkNull(
    responseData.title,
    "hero and heroine"
  )}>
    <ul class="movie-info" id=${chkNull(responseData._id, "To be Named")}>
        <li class="movie-show-time" id=${chkNull(
          responseData._id,
          "To be Named"
        )}><a class="movie-more-info" id=${chkNull(
    responseData._id,
    "To be Named"
  )} href="#">${chkNull(
    responseData.sessions[0].sessionDateTime[0],
    "Coming Soon"
  )}</a></li>
        <li class="movie-language" id=${chkNull(
          responseData._id,
          "To be Named"
        )}>${chkNull(responseData.language, "All Languages")}</li>
    </ul>
</div>`;
};

const chkNull = (val, defaultVal) => {
  if (val) {
    return val;
  } else return defaultVal;
};

const displayListView = apiData => {
  resultElement.innerHTML = apiData.map(data => renderHtml(data)).join("\n");
  let thumbnails = document.querySelectorAll("#movies > div > img");
  thumbnails.forEach(function(thumbnail) {
    thumbnail.addEventListener("click", function() {
      // Set clicked image as display image.
      NavDetailview(thumbnail.id);
    });
  });
};

const NavDetailview = id => {
  let movieDetails = APIData.find(function(element) {
    return element._id === id;
  });
  console.log(movieDetails);
  console.log(movieDetails.sessions);

  movieDetails.sessions.forEach(session => {
    console.log(session.state + "-" + session.location);
    console.log(createSessionhtml(session.sessionDateTime));
  });

  resultElement.innerHTML = `<div class="movie-details-tcontainer" id="moviedetailscontainer">
  <div class="movie-details-trailer" id="moviedetailstrailer">
      <iframe class="movie-trailer" id="${
        movieDetails._id
      }" src="https://www.youtube.com/embed/${
    movieDetails.trailer.split("=")[1]
  }"
frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>
  </div>
  <div class="movie-details-info" id="moviedetailsinfo">
      <div class="movie-info-list" id="movieinfolist">
          <div class="movie-genre" id="moviegenre"><span class="genre-detail" id="genredetail">Genre :</span>
              Commercial</div>
          <div class="movie-duration" id="movieduration"><span class="genre-detail" id="genredetail">Duration
                  :</span> 2h 30m <i class="fa fa-hourglass-half movie-duration-time" id="moviedurationtime"
                  aria-hidden="true"></i></div>
          <div class="movie-rating" id="movierating">
              ${(
                '<i class="fa fa-star movie-star-rating" id="' +
                movieDetails._id +
                '" aria-hidden=" true"></i>'
              ).repeat(3)}
              <i class="fa fa-star-half-o movie-star-rating" id="moviestarrating" aria-hidden=" true"></i>
              <i class="fa fa-star-o movie-star-rating" id="moviestarrating" aria-hidden=" true"></i>
          </div>
          <div class="movie-details-session">
                  ${movieDetails.sessions
                    .map(session => {
                      return (
                        session.state +
                        " - " +
                        session.location +
                        "<br>" +
                        createSessionhtml(session.sessionDateTime)
                      );
                    })
                    .join("\n")}</div>
      </div>
  </div>
</div>
<div class="movie-details-story-container" id="moviedetailsstorycontainer">
  <div class="movie-details-story" id="moviedetailsstory">
      <div class="movie-details-title"> ${movieDetails.title}</div>
      <div class="movie-detailed-script" id="moviedetailedscript">
          <p>${movieDetails.synopsis}</p>
      </div>
      <div class="movie-details-title"><i class="fa fa-users movie-cast" id="moviecast" aria-hidden="true"></i>Starring</div>
      <ul class="movie-cast-list" id="moviecastlist">
      ${movieDetails.leadActors
        .split(",")
        .map(leadActor => {
          return '<li class="movie-cast-name" id="">' + leadActor;
        })
        .join(",</li>\n") + ".</li>"}
      </ul>
      <div class="movie-crew">Crew</div>
      <ul class="movie-crew-list" id="moviecrewlist">
          <li class="movie-crew-name" id="moviecrewname"><span class="genre-detail" id="genredetail">Director
                  :</span>
              ${movieDetails.crew.director},</li>
          <li class="movie-crew-name" id="moviecrewname"><span class="genre-detail" id="genredetail">Music-Director
                  :</span>
              ${movieDetails.crew.musicDirector}</li>
      </ul>

  </div>
  <div class="movie-details-booking" id="moviedetailsbooking">
      <button class="movie-book-btn"><i class="fa fa-ticket movie-ticket" id="movieticket" aria-hidden="true"></i>Book
          now</button>
      <button id='detailsBackBtn' class="movie-back-btn"><i class="fa fa-undo previous-page" id="previouspage" aria-hidden="true"></i>Back</button>

  </div>


</div>`;

  function createSessionhtml(sessionDateTimes) {
    let sessionObj = {};
    let dateTimeHtmlElement = "";

    sessionDateTimes.forEach(sessionDateTime => {
      sessionObj[sessionDateTime.split(" ")[0]] = [];
    });

    sessionDateTimes.forEach(sessionDateTime => {
      sessionObj[sessionDateTime.split(" ")[0]].push(
        sessionDateTime.split(" ")[1]
      );
    });

    Object.keys(sessionObj).forEach(date => {
      dateTimeHtmlElement +=
        '<i class="fa fa-calendar movie-session-calendar" id="${movieDetails._id}" aria-hidden="true"></i> ' +
        date +
        ' : <i class="fa fa-clock-o movie-session-clock" id="${movieDetails._id}" aria-hidden="true"></i> ';
      dateTimeHtmlElement += sessionObj[date].join(", ");

      dateTimeHtmlElement += "<br>";
    });

    return dateTimeHtmlElement;
  }

  let backBtn = document.querySelector("#detailsBackBtn");
  backBtn.addEventListener("click", function() {
    displayListView(APIData);
    // window.history.back();
    console.log("clicked back");
  });
};
