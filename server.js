// load .env data into process.env
require('dotenv').config();

// Web server config
const PORT       = process.env.PORT || 8080;
const ENV        = process.env.ENV || "development";
const express    = require("express");
const bodyParser = require("body-parser");
const sass       = require("node-sass-middleware");
const app        = express();
const morgan     = require('morgan');
const cookieSession = require('cookie-session');

// PG database client/connection setup
const { Pool } = require('pg');
const dbParams = require('./lib/db.js');
const db = new Pool(dbParams);
db.connect();

module.exports = { db }

// Load the logger first so all (static) HTTP requests are logged to STDOUT
// 'dev' = Concise output colored by response status for development use.
//         The :status token will be colored red for server error codes, yellow for client error codes, cyan for redirection codes, and uncolored for all other codes.
app.use(morgan('dev'));
app.set('views', './views');
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/styles", sass({
  src: __dirname + "/styles",
  dest: __dirname + "/public/styles",
  debug: true,
  outputStyle: 'expanded'
}));
app.use(express.static("public"));

// add cookie session
app.use(cookieSession({
  name: 'session',
  keys: ['beer', 'cider']
}));

// Separated Routes for each Resource
// Note: Feel free to replace the example routes below with your own
const usersRoutes = require("./routes/users");
// const featuredItems = require("./routes/featuredItemsRoutes");
const homepage = require("./routes/userRoutes");
const vendorsRoutes = require("./routes/vendorRoutes");
// how come search is routing to /vendors? can we rename that to search?
const search = require("./routes/vendors")
const messages = require(("./routes/messagesRoutes"))
// Mount all resource routes
// Note: Feel free to replace the example routes below with your own
app.use("/api/users", usersRoutes(db));
app.use("/", homepage(db));
app.use("/vendors", vendorsRoutes(db));
app.use("/search", search(db));
app.use("/api/messages", messages(db));
// Note: mount other resources here, using the same pattern above

// app.use('/', (req, res, next) => {//app.use works for EVERYTHING (get, post)
//   const userID = req.session.user_id;
//   const whiteList = ['/urls', '/login', '/register', '/logout'];
//   if (users[userID]) { //check if we have userID (from cookie from registering) in our user database
//     next(); //goes to next http request
//   } else if (whiteList.includes(req.path) || req.path.startsWith('/u/')) {
//     next();
//   } else {
//     res.redirect('/urls'); //if not, redirect to homepage
//   }
// });



// Home page
// Warning: avoid creating more routes in this file!
// Separate them into separate routes files (see above).


// app.get("/", (req, res) => {
//   res.render("urls_index")
// });

// app.get("/discover", (req, res) => {
//   res.render("urls_discover");
// });

// app.get("/favourites", (req, res) => {
//   res.render("urls_favourites");
// });

// app.get("/messages", (req, res) => {
//   res.render("urls_messages");
// });

// app.get("/profile", (req, res) => {
//   res.render("urls_profile");
// });

// app.get("/sell", (req, res) => {
//   res.render("urls_sell");
// });

// app.get("/login", (req, res) => {
//   res.render("urls_sell");
// });

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});

