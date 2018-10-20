require("regenerator-runtime/runtime");

// import environmental variables from our variables.env file
require("dotenv").config({ path: ".env" });
const helper = require("./helpers");

//Emit app mode - prod vs dev
console.log(`***** Application mode ${helper.getAppMode()}`);

// Set up mongoose connection - Specfic URI in Environment variables takes precedence
// Connect to our Database and handle any bad connections
const mongoose = require("mongoose");
const dbURI =
  helper.getAppMode() == "PROD"
    ? process.env.DB_URI_PROD
    : process.env.DB_URI_DEV;
mongoose.connect(
  dbURI,
  { useNewUrlParser: true }
);
console.log(`***** Connecting to DB @ ${dbURI}`);

mongoose.Promise = global.Promise; // Tell Mongoose to use ES6 promises
mongoose.connection.on("error", err => {
  console.error(`🙅 🚫 🙅 🚫 🙅 🚫 🙅 🚫 → ${err.message}`);
});

// import all of our models
require("./movie.model");

// Start our app!
const app = require("./app");
app.set("port", process.env.PORT || 5000);
const server = app.listen(app.get("port"), () => {
  console.log(
    `******Movie-App Serverside started on  → PORT ${server.address().port}`
  );
});
