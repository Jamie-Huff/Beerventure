const express = require('express');
const router  = express.Router();
const {
  getUserByEmail,
  getFeaturedProducts,
  addNewUser,
  getVendorByEmail,
  getUserFavourites,
  unFavouriteItem,
  addFavouriteItem
} = require('./database');

const bcrypt = require('bcrypt');
const saltRounds = 10;


module.exports = (db) => {

  // ---------------------------------------------- HOMEPAGE (RENDER w PRODUCTS & CHECK FOR SESSION COOKIE)
  router.get('/', (req, res) => {
    // get user email from session cookie
    const user = req.session.user;

    // Anonymous user landing on homepage - no session cookie
    if (!user) {
      // helper function to retrieve products from DB
      getFeaturedProducts()
        .then(products => {
          const templateVars = {
            userObject: null,
            products: products,
          };
          return res.render("../views/urls_index", templateVars);
        })
        .catch((err) => {
          res.status(500).json({ error: err.message });
        });
    } else {
      // Session cookie does exist
      // check if cookie has vendor: true
      if (user.vendor) {
        return res.redirect('/vendors');
      }

      // helper function to retrieve products from DB
      getFeaturedProducts()
      .then(products => {
        const templateVars = {
          userObject: user,
          products: products,
        };
        // if user does exist in DB but password doesn't match (user === null)
        // -----------------------------------TO DO: should be updated to better output (failure message)
        if (!user) {
          return res.render("../views/urls_index", templateVars);
        }
        // if user does exist in DB and password matches (data === userDBObject)
        if (user) {
          return res.render("../views/urls_index", templateVars);
        }
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
    };
  });

    // ---------------------------------------------- USER PROFILE (RENDER)

  // Render Login Page:
  router.get('/profile', (req, res) => {
    const user = req.session.user;
    const templateVars = {userObject: user}
    if (!user) {
      return res.render("../views/urls_login");
    }
    if (user.vendor) {
      return res.render("../views/urls_vendor_profile");
    }
    return res.render("../views/urls_profile", templateVars);
  });


    // ---------------------------------------------- LOG IN (RENDER)

  // Render Login Page:
  router.get('/login', (req, res) => {
    // Check if session cookie exists,
    const user = req.session.user;
    if (user) {
      return res.send({"error":"already logged in"});
    }
    // -----------------------------------TO DO: Change this route to user profile page
    return res.render("../views/urls_login");
  });

    // ---------------------------------------------- LOG IN (POST)

	// On login button submit
  router.post('/login', (req, res) => {
    const {email, password} = req.body;

    // -----------------------------------TO DO: Provide user with an error if password isn't valid, redirect back to login page

    getUserByEmail(email)
      .then(user => {
            if (user) {
              bcrypt.compare(password, user.password);
              req.session.user = user;
            }
          })
      .then(result => {
        return res.redirect('/profile');
      })
      .catch(err => console.error('error', err.stack))

  });


  router.post('/vendors/login', (req, res) => {
    const {email, password} = req.body;
    console.log('email: ', email);

    // -----------------------------------TO DO: Provide user with an error if password isn't valid, redirect back to login page

    getVendorByEmail(email)
      .then(vendor => {
            if (vendor) {
              bcrypt.compare(password, vendor.password);
              vendor.vendor = true;
              req.session.user = vendor;
            }
          })
      .then(result => {
        return res.redirect('/vendors');
      })
      .catch(err => console.error('error', err.stack))
  });





  // ---------------------------------------------- LOG OUT
  router.get('/logout', (req, res) => {
    req.session = null;
    res.redirect("/")
  });


  // ---------------------------------------------- REGISTER NEW USER
  router.get('/register', (req, res) => {
    // get user email from session cookie
    const user = req.session.user;
    // if session cookie exists, redirect to homepage TO DO - CHANGE THIS TO REDIRECT TO USER'S PAGE
    if (user) return res.send({"error":"already logged in"});
    // if user doesn't have a session cookie, show the registration page
    return res.render('../views/urls_register_user');
  });


  // On register for an account button submit
  router.post('/register', (req, res) => {
    const newUser = req.body;
    // bcrypt the password
    newUser.password = bcrypt.hashSync(newUser.password, saltRounds);

    // Check if user email already exists in DB. Redirect to login page
    // -----------------------------------TO DO: Provide user with a relevant error message
    // -----------------------------------TO DO: Validate all inputs, provide user with appropriate error messages
    getUserByEmail(newUser.email)
    .then(userData => {
        // helper function to retrieve products from DB
        getVendorByEmail(newUser.email)
        .then(vendorData => {
          // -----------------------------------TO DO: should be updated to better output (failure message)
          if (userData || vendorData) {
            // if user does exist in DB users table, redirect to login to their account
            userData ? res.send({"existingAccount":"users"}) : null;
            // if user does exist in DB vendors table, redirect to login to their account
            vendorData ? res.send({"existingAccount":"vendors"}) : null;
            return res.redirect('/login');
          }
        })
        // -----------------------------------TO DO: BUG! CURRENTLY TRYING TO SEND AN ERROR BEFORE REGISTERING NEW USER
      .catch(e => res.send(e));
    });

    // if email doesn't exist in DB, register the user by INPUTing their data in user database
    addNewUser(newUser)
      .then(user => {
        if (!user) {
          res.send({error: "error"});
          return;
        }
        req.session.user = user;
        return res.redirect('/profile');
      })
    // once registered, res.render search page? - TO DO: Decide on age a new user lands on
  });



  // ---------------------------------------------- PRODUCT LOAD PAGE
  router.get('/favourites', (req, res) => {
    // get user cookie if exists
    const user = req.session.user

    if (user) {
      // user is logged in
      getUserFavourites(user.id)
      .then(data => {
        let templateVars;
        if (user) {
          templateVars = {
            userObject,
            favourites: data
          }
        } else {
          templateVars = {
            userObject: null,
            favourites: data
          }
        }
        return res.render("urls_favourites", templateVars)
      })
      .catch(err => {
        res
        .status(500)
        .json({ error: err.message });
      });
    } else {
      // user is not logged in
      return res.redirect('/login');
    }
  });


  // ----------------------------------------------------------------- REMOVE FAVOURITED ITEM
  router.post('/favourites', (req, res) => {
    // favouriteId = the fav id of our table
    const favouriteId = req.body
    favouriteId = JSON.stringify(favouriteId)
    favouriteId = favouriteId.substring(1, favouriteId.length - 1)
    favouriteId = favouriteId.split(':')[0]
    favouriteId = JSON.parse(favouriteId)
    favouriteId = Number(favouriteId)

    // get user cookie if exists
    const user = req.session.user;

    if (user) {
      // user is logged in
      unFavouriteItem(favouriteId)
      .then (data => {
        return res.redirect('/favourites')
        .catch(err => console.error('error', err.stack))
      })
    } else {      
      // user is not logged in
      return res.redirect('/login');
    }
  });


  // ----------------------------------------------------------------- ADD FAVOURITE ITEM
  router.post('/favourites/add', (req, res) => {
    // favouriteId = the fav id of our table
    const favouriteId = req.body
    favouriteId = JSON.stringify(favouriteId)
    favouriteId = favouriteId.substring(1, favouriteId.length - 1)
    favouriteId = favouriteId.split(':')[0]
    favouriteId = JSON.parse(favouriteId)
    favouriteId = Number(favouriteId)

    // get user cookie if exists
    const user = req.session.user;

    if (user) {
      // user is logged in:
      addFavouriteItem(favouriteId, user.id)
        .then (data => {
          console.log(data);
          return res.redirect('/favourites')
        })
        .catch(err => console.error('error', err.stack))
    } else {
      // user is not logged in
      return res.redirect('/login');
    }
  });

  return router;
};

