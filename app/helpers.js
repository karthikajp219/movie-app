"use strict";

/*
  This is a file of data and helper functions that we can expose and use in our templating function
*/

// FS is a built in module to node that let's us read files from the system we're running on
var fs = require("fs");

// moment.js is a handy library for displaying dates. We need this in our templates to display things like "Posted 5 minutes ago"
// exports.moment = require('moment');

// Dump is a handy debugging function we can use to sort of "console.log" our data
exports.dump = function (obj) {
  return JSON.stringify(obj, null, 2);
};

// Making a static map is really long - this is a handy helper function to make one
// exports.staticMap = ([lng, lat]) =>
//   `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=14&size=800x150&key=${
//     process.env.MAP_KEY
//   }&markers=${lat},${lng}&scale=2`;

// inserting an SVG
exports.icon = function (name) {
  return fs.readFileSync("./public/images/icons/" + name + ".svg");
};

// Some details about the site
exports.siteName = process.env.SITE_NAME || "Indian Movies";

exports.menu = [{ slug: "/stores", title: "Stores", icon: "store" }, { slug: "/tags", title: "Tags", icon: "tag" }, { slug: "/top", title: "Top", icon: "top" }, { slug: "/add", title: "Add", icon: "add" }, { slug: "/map", title: "Map", icon: "map" }];

// export function () removeLastComma(strng){
//   var n=strng.lastIndexOf(",");
//   var a=strng.substring(0,n)
//   return a;
// }

exports.stripTrailingCommas = function (_string) {
  return _string.replace(/,\s*$/, "");
};

exports.getAppMode = function () {
  var appMode = process.env.NODE_ENV.toLowerCase();
  console.log(appMode);
  switch (true) {
    case !appMode:
      console.log("!!!!! Application mode not defined in .env file / web server");
      return "Undefined";
      break;

    case appMode == "production":
      return "PROD";
      break;
    case appMode == "development":
      return "DEV";
  }
};