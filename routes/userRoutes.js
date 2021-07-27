const express = require('express');
const router  = express.Router();
const { getUserByEmail, getFeaturedProducts, getVendorByEmail, addNewUser } = require('./database');

// Move these two if authenticateUser() moves:
const bcrypt = require('bcrypt');
const saltRounds = 10;


module.exports = (db) => {

  // ---------------------------------------------- HOMEPAGE (RENDER w PRODUCTS & CHECK FOR SESSION COOKIE)
  router.get('/', (req, res) => {
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
  router.get('/login', (req, res) => {
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
  });

  // ---------------------------------------------- LOG OUT
  // ---------------------------------------------------------TO DO: link to a logout button

  router.post('/logout', (req, res) => {
    req.session.userId = null;
    res.redirect("/")
  });


  // ---------------------------------------------- REGISTER NEW USER
  // ---------------------------------------------------------TO DO: link to a register button on homepage

  router.get('/register', (req, res) => {
    // get user email from session cookie
    const userEmail = req.session.userId;
    // if session cookie exists, redirect to homepage TO DO - CHANGE THIS TO REDIRECT TO USER'S PAGE
    if (userEmail) return res.redirect('/');
    // if user doesn't have a session cookie, show the registration page
    return res.render('../views/urls_register_user');
  });


  // On register for an account button submit
  router.post('/register', (req, res) => {
    // const {name, email, password, phone} = req.body;
    const newUser = req.body;
    console.log('newUser: ', newUser);
    // bcrypt the password
    newUser.password = bcrypt.hashSync(newUser.password, saltRounds);
    console.log('newUser after the hash: ', newUser);

    // Check if user email already exists in DB. Redirect to login page
    // -----------------------------------TO DO: Provide user with a relevant error message
    // -----------------------------------TO DO: Validate all inputs, provide user with appropriate error messages
      // call to get user by form email.
    /*
    getUserByEmail(email)
      .then(res => {
        console.log('res line 131: ', res);
        if (res) {
          return res;
        }
        return false;
      })
      .then(second => {
        if (second) {
          console.log('second line 135: ', res);
          return res.render('/login');
        }
      })
      .catch(err => console.error('query error', err.stack));
      */

    /*
    const userExists = async function(email) {
      try{
        const isUser = await getUserByEmail(email);
        const isVendor = await getVendorByEmail(email);
        return {isUser, isVendor}
      } catch(err) {
        console.log(err.message);
      }
    }
    */

      // call to get vendor by form email




    // if email doesn't exist in DB, register the user by INPUT in user database
    addNewUser(newUser)
      .then(user => {
        if (!user) {
          res.send({error: "error"});
          return;
        }
        req.session.userId = user.id;
        res.redirect('/');
      })
      .catch(e => res.send(e));






    // once registered, res.render search page? - TO DO: Decide on age a new user lands on



  });




  // START - DELETE THIS
  /*
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
  });
  */
  // END - DELETE THIS



  // ---------------------------------------------- END REGISTER NEW USER


  return router;
};

