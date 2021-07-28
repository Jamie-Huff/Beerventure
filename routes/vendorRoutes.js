const express = require('express');
const router  = express.Router();
const { addNewVendor, getVendorByEmail, getVendorsProducts } = require('./database');

const bcrypt = require('bcrypt');
const saltRounds = 10;


module.exports = (db) => {

  // ---------------------------------------------- HOMEPAGE (RENDER w PRODUCTS & CHECK FOR SESSION COOKIE)
  router.get('/', (req, res) => {
    console.log("AT ROUTE /");
    // get user email from session cookie
    const vendor = req.session.user;
    // console.log('VENDOR COOKIE: ', vendor);

    // Anonymous user landing on homepage - no session cookie
    if (!vendor) {
      // if vendor lands on /vendors and doesn't have a session cookie, redirect to login
      return res.render("../views/urls_login");

    } else {
      // Session cookie does exist, check if user is a vendor
      if (vendor.vendor) {
        // helper function to retrieve products from DB
        getVendorsProducts(vendor.email)
          .then(products => {
            const templateVars = {
              userObject: vendor,
              products: products,
            };
            // console.log("PRODUCTS", products);
            // console.log("TEMPLATEVARS", templateVars);
            // render vendor's profile page:
            return res.render("../views/urls_vendor_profile", templateVars);
          })
          .catch((err) => {
            return res.status(500).json({ error: err.message });
          });
      } else {
        console.log('HERE');
        return res.status(403).json({ error: "not authorized. you are not a vendor" });
      }
    }

  });


  // ---------------------------------------------- VENDOR PROFILE (RENDER)
  router.get('/profile', (req, res) => {
    // get user email from session cookie
    const vendor = req.session.user;
    const vendorEmail = vendor.email;

    if (!vendor) {
      // if vendor lands on /vendors and doesn't have a session cookie, redirect to login
      return res.render("../views/urls_login");
    }
    res.redirect('/');

    getVendorByEmail(vendorEmail)
      .then(vendorData => {
        if (vendorData) {
          getVendorsProducts(vendorEmail)
            .then(products => {
              const templateVars = {
                userObject: vendor,
                products: products,
              };
              // redirect to vendor's profile page:
              res.redirect('/', templateVars);
            })
            .catch((err) => {
              return res.status(500).json({ error: err.message });
            });
        }
      });

  });


  // ---------------------------------------------- LOG IN (RENDER)
  /*
  // Render Login Page:
  router.get('/login', (req, res) => {
    // Check if session cookie exists,
    const user = req.session.user;
    if (user) {
      res.render("/")
    }
    // -----------------------------------TO DO: Change this route to user profile page
    res.render("../views/urls_login")
  });
  */
  // ---------------------------------------------- LOG IN (POST)

	router.post('/login', (req, res) => {
    const {email, password} = req.body;
    console.log('email: ', email);

    // -----------------------------------TO DO: Provide user with an error if password isn't valid, redirect back to login page

    getVendorByEmail(email)
      .then(vendor => {
        if (vendor) {
          bcrypt.compare(password, vendor.password);
          req.session.user = vendor;
        }
      })
      .then(result => {
        return res.redirect('/vendors/profile');
      })
      .catch(err => console.error('query error', err.stack));
  });

  // ---------------------------------------------- LOG OUT
  // ---------------------------------------------------------TO DO: link to a logout button
  /*
  router.post('/logout', (req, res) => {
    req.session.user = null;
    res.redirect("/")
  });
  */


  // ---------------------------------------------- REGISTER NEW VENDOR
  // ---------------------------------------------------------TO DO: link to a register button on homepage

  router.get('/register', (req, res) => {
    // get vendor email from session cookie
    const user = req.session.user;
    // if session cookie exists, redirect to homepage TO DO - CHANGE THIS TO REDIRECT TO VENDOR'S PAGE
    if (user) {
      if (user.vendor) {
        return res.send({"error":"vendor already logged in"});
      }
    }
    // if vendor doesn't have a session cookie, show the registration page
    return res.render('../views/urls_register_vendor');
  });


  // On register for an account button submit
  router.post('/register', (req, res) => {
    const newVendor = req.body;
    // bcrypt the password
    newVendor.password = bcrypt.hashSync(newVendor.password, saltRounds);

    // Check if vendor email already exists in DB. Redirect to login page
    // -----------------------------------TO DO: Provide vendor with a relevant error message
    // -----------------------------------TO DO: Validate all inputs, provide vendor with appropriate error messages
    getVendorByEmail(newVendor.email)
      .then(vendorData => {
        if (vendorData) {
        // if vendor exists in DB vendors table, redirect to login to their account
          vendorData ? res.send({"existingAccount":"vendors"}) : null;
          return res.redirect('/login');
        }
      })
      .catch(e => res.send(e));

    // if email doesn't exist in DB, register the user by INPUTing their data in user database
    // add a vendor boolean to the cookie
    newVendor.vendor = true;

    addNewVendor(newVendor)
      .then(vendor => {
        if (!vendor) {
          res.send({error: "error"});
          return;
        }
        req.session.user = newVendor;
        return res.redirect('/profile');
      })
      .catch(e => res.send(e));

  });
  // ---------------------------------------------- END REGISTER NEW VENDOR


  return router;
};

