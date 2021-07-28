const express = require('express');
const router  = express.Router();
const { addNewVendor, getVendorByEmail, getVendorsProducts, addNewProduct } = require('./database');

const bcrypt = require('bcrypt');
const saltRounds = 10;


module.exports = (db) => {

  // ---------------------------------------------- HOMEPAGE (RENDER w PRODUCTS & CHECK FOR SESSION COOKIE)
  router.get('/', (req, res) => {
    // get user email from session cookie
    const vendor = req.session.user;

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
            // render vendor's profile page:
            return res.render("../views/urls_vendor_profile", templateVars);
          })
          .catch((err) => {
            return res.status(500).json({ error: err.message });
          });
      } else {
        return res.status(403).json({ error: "not authorized. you are not a vendor" });
      }
    }

  });


    // ---------------------------------------------- LOG IN (RENDER)
    // Handled in userRoutes.js
  
    // ---------------------------------------------- LOG IN (POST)

	  router.post('/login', (req, res) => {
    const {email, password} = req.body;

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
      .catch(err => console.error('query error', err.stack))
  });

  // ---------------------------------------------- LOG OUT
  // ---------------------------------------------------------TO DO: link to a logout button
  // Unsure if this will be handled in vendorRoutes or UserRoutes for both
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
          res.send({error: 'error'});
          return;
        }
        req.session.user = newVendor;
        return res.redirect('/profile');
      })
      .catch(e => res.send(e));

  });


  // ---------------------------------------------- POST NEW ITEM

  router.post('/new_item', (req, res) => {
    const vendor = req.session.user;

    const newItem = req.body;
    newItem.vendor_id = vendor.id;
    // do some entry validation
    newItem.price = newItem.price * 100;
    newItem.abv = newItem.abv * 100;
    if (newItem.featured_check == 'on') {
      newItem.featured_check = true;
    } else {
      newItem.featured_check = false;
    }

    // watch for price in cents, mL, and the percentage

    // Placeholder image:
    // TO DO: Figure out how to handle images properly. Unsure how they get output to page
    newItem.image = 'https://images.unsplash.com/photo-1523567830207-96731740fa71?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=634&q=80';
    console.log('newItem: ', newItem);
    

    addNewProduct(newItem)
      .then(item => {
        if (!item) {
          res.send({error: 'error'});
          return;
        }
        return res.redirect('/vendors');
      })
      .catch(e => res.send(e))

  });




  return router;
};

