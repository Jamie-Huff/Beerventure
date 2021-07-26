const express = require('express');
const { getUserByEmail, getFeaturedProducts } = require('./database');
const router  = express.Router();
// const bcrypt = require('bcrypt');



module.exports = (db) => {

  // Homepage
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
      // -----------------------------------TO DO: VALIDATE USER BASED ON PASSWORD
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });

  // Render Login Page:
  router.get("/login", (req, res) => {
    // -----------------------------------TO DO: check if session cookie exists, render urls_index instead (or profile?)
    res.render("../views/urls_login")
  });

	// On login button submit
  router.post('/login', (req, res) => {
    const {email, password} = req.body;

    // -----------------------------------TO DO: VALIDATE USER BASED ON PASSWORD
    getUserByEmail(email)
    .then(res => {
      if (res.rows[0]) {
        return res.rows[0]
      }
      return null
    })
    .then(user => {
          if (!user) {
            res.send({error: "error"});
            return;
          }
          req.session.userId = user.id;
          res.redirect("/")
        })
    .catch(err => console.error('query error', err.stack));
  });



  return router;
};

