const express = require("express");
const app = express();
const morgan = require("morgan");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

//import appwide routes
import appRoutes from "./app.route";
import movieRoutes from "./movie.route";

// Set up mongoose connection - Specfic URI in Environment variables takes precedence
const dbURI =
  process.env.DB_URI ||
  `mongodb://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${
    process.env.DB_HOST
  }/${process.env.DB_NAME}`;
  
mongoose.connect(
  dbURI,
  { useNewUrlParser: true }
);
mongoose.Promise = global.Promise;
const db = mongoose.connection;

db.on("error", console.error.bind(console, "MongoDB connection error:"));

//Web Server
app.use(morgan("dev")); //HTTP request logger

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    return res.status(200).json({});
  }
  next();
});

//Assign Route definitions to the request

//app.use("/", mainRoutes);
app.use(["/movie", "/movies"], movieRoutes);

let port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log("Movie App server is up and running on port numner " + port);
});
