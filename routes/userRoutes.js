const express = require('express');
const router  = express.Router();
const { getUserByEmail, getFeaturedProducts } = require('./database');

// Move these two if authenticateUser() moves:
const bcrypt = require('bcrypt');
const saltRounds = 10;

// Helper Functions (Not DB calls) - could be moved to a different file
const authenticateUser = function(entered, userObject) {
  return bcrypt.compareSync(entered, userObject.password)
}


module.exports = (db) => {

  // ---------------------------------------------- HOMEPAGE (RENDER w PRODUCTS & CHECK FOR SESSION COOKIE)
  router.get("/", (req, res) => {
    // get user email from session cookie
    const userEmail = req.session.userId;

    // Anonymous user landing on homepage - no session cookie
    if (!userEmail) {
      // helper function to retrieve products from DB
      getFeaturedProducts()
        .then(products => {
          const templateVars = {
            userObject: null,
            products: products,
          };
          console.log("templateVars: ", templateVars);
          return res.render("../views/urls_index", templateVars);
        })
        .catch((err) => {
          res.status(500).json({ error: err.message });
        });
    };

    // Session cookie does exist
    // helper function to retrieve userObject from DB
    getUserByEmail(userEmail)
      .then(data => {

          // helper function to retrieve products from DB
          getFeaturedProducts()
          .then(products => {
            const templateVars = {
              userObject: data,
              products: products,
            };

            // if user does exist in DB but password doesn't match (data === null)
            // -----------------------------------TO DO: should be updated to better output (failure message)
            if (!data) {
              return res.render("../views/urls_index", templateVars);
            }

            // if user does exist in DB and password matches (data === userDBObject)
            if (data) {
              console.log("data, line 57: ", data);
              return res.render("../views/urls_index", templateVars);
            }
          })
        .catch((err) => {
          res.status(500).json({ error: err.message });
        });
      })

      // if user doesn't exist in DB (promise failed to return)
      // -----------------------------------TO DO: Prompt user to sign up / redirect to sign up
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });

    // ---------------------------------------------- LOG IN (RENDER)

  // Render Login Page:
  router.get("/login", (req, res) => {
    // -----------------------------------TO DO: check if session cookie exists, render urls_index instead (or profile?)
    res.render("../views/urls_login")
  });

    // ---------------------------------------------- LOG IN (POST)

	// On login button submit
  router.post('/login', (req, res) => {
    const {email, password} = req.body;

    // -----------------------------------TO DO: Provide user with an error if password isn't valid

    // THIS NEEDS TO BE FIXED:
    getUserByEmail(email)
    .then(res => bcrypt.compare(password, res.password))
    .then(compare => {
      compare ? req.session.userId = res.id : null
      compare ? res.redirect("/") : res.redirect("/login")
    })
    .catch(err => console.error('query error', err.stack));



    // ---------------------------------------------- LOG OUT
    router.post('/logout', (req, res) => {
      req.session.userId = null;
      res.redirect("/")
    });

  });


  return router;
};

