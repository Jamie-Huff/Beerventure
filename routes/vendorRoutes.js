const express = require('express');
const router  = express.Router();
const { getVendorByEmail, getVendorsProducts } = require('./database');

// Move these two if authenticateUser() moves:
const bcrypt = require('bcrypt');
const saltRounds = 10;

    // -----------------------------------TO DO:  GO THROUGH ALL ROUTES AND MAKE SURE COOKIES ARE CORRECT


module.exports = (db) => {

  // ---------------------------------------------- HOMEPAGE (RENDER w PRODUCTS & CHECK FOR SESSION COOKIE)
  router.get("/vendors", (req, res) => {

    // Temporary:
    // return res.render("../views/urls_index");

    // get user email from session cookie
    const user = req.session.user;
    const userEmail = user.email;

    // Anonymous user landing on homepage - no session cookie
    if (!userEmail) {
      res.render("/login")
    };

    // Session cookie does exist
    // helper function to retrieve vendorObject from DB
    getVendorByEmail(userEmail)
      .then(data => {
          // helper function to retrieve only the vendor's products from DB
          getVendorsProducts(userEmail)
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
    // unnecessary. vendors and users can share a log in form


    // ---------------------------------------------- LOG OUT (UNSURE IF THIS IS STILL NECESSARY. DON'T THINK SO)
    // router.post('/logout', (req, res) => {
    //   req.session.user = null;
    //   res.redirect("/")
    // });

  // });


  return router;
};

