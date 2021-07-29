const express = require('express');
const router  = express.Router();
const { getUserByEmail, getFeaturedProducts, addNewUser, getVendorByEmail, addMessages } = require('./database');

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
    // console.log("USER: ", user);
    if (!user) {
      return res.render("../views/urls_login");
    }
    if (user.vendor) {
      getFeaturedProducts()
      .then(products => {
        const templateVars = {
          userObject: user,
          products: products,
          isVendor: true
        };
        return res.render("../views/urls_vendor_profile", templateVars);
      });
    }
    const templateVars = {
      userObject: user,
      isVendor: false
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
      .catch(err => console.error('query error', err.stack))

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
      .catch(err => console.error('query error', err.stack))
  });





  // ---------------------------------------------- LOG OUT
  // ---------------------------------------------------------TO DO: link to a logout button

  router.get('/logout', (req, res) => {
    req.session.user = null;
    res.redirect("/")
  });


  // ---------------------------------------------- REGISTER NEW USER
  // ---------------------------------------------------------TO DO: link to a register button on homepage

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
        res.redirect('/urls_profile');
      })
    // once registered, res.render search page? - TO DO: Decide on age a new user lands on
  });
  // ---------------------------------------------- END REGISTER NEW USER


  // ---------------------------------------------- product load page
    router.get('/favourites', (req, res) => {
      const userObject = req.session.user
      const userId = userObject.id
      let user = req.session.user
      console.log(userId)
        let query = `SELECT items.name as item_name,
                        vendors.name as vendor_name,
                        items.price as item_price,
                        items.category as item_category,
                        items.image as item_image
        FROM items
        JOIN favourites ON items.id = favourites.item_id
        JOIN vendors ON vendors.id = items.vendor_id
        WHERE ${userId} = favourites.user_id

        `;
        return db.query(query)
          .then(data => {
            console.log(query)
            let templateVars;
            const favourites = data.rows;
            if (user) {
              templateVars = {
                favourites: data.rows,
                userObject,
              }
            } else {
              templateVars = {
              favourites: data.rows,
              userObject: null
              }
            }
            console.log(templateVars.favourites)
            res.render("urls_favourites", templateVars)
          })
          .catch(err => {
            res
              .status(500)
              .json({ error: err.message });
          });
      });
  // --------------------------------------------------------------------
  return router;
};

