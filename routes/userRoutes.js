const express = require('express');
const { getUserByEmail, getFeaturedProducts } = require('./database');
const router  = express.Router();
// const bcrypt = require('bcrypt');



module.exports = (db) => {

  // OLD homepage Get
  /*
  router.get("/", (req, res) => {
    db.query(`SELECT * FROM vendors;`)
      .then(data => {
        res.render("urls_index")
        console.log(data.rows)
        const users = data.rows;
        res.json({ users });
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });
  */


  // New homepage Get
  router.get("/", (req, res) => {
    // get user email from session cookie
    const userEmail = req.session.userId;

    // Anonymous user landing on homepage
    if (!userEmail) {
      getFeaturedProducts()
        .then(products => {
          const templateVars = {
            userObject: null,
            products: products,
          };
          console.log("templateVars: ", templateVars);
          return res.render("../views/urls_index", { templateVars });
        })
        .catch((err) => {
          res.status(500).json({ error: err.message });
        });
    };

    getUserByEmail(userEmail)
    .then(result => console.log('result: ', result))

    // helper function to retrieve userObject from DB
    getUserByEmail(userEmail)
      .then(data => {

          // helper function to retrieve products from DB
          getFeaturedProducts()
          .then(products => {
            // console.log('products line 46: ', products)
            const templateVars = {
              userObject: data,
              products: products,
            };
            console.log("templateVars: ", templateVars);

            // if user does exist in DB but password doesn't match (data === null)
            // or if page is loaded with no existing session cookie (data === null since userEmail = undefined)
            if (!data) {
              return res.render("../views/urls_index", { templateVars });
            }

            // if user does exist in DB and password matches (data === userDBObject)
            if (data) {
              console.log("data, line 57: ", data);
              // console.log("products, line 58: ", products);
              return res.render("../views/urls_index", { templateVars });
            }
          })
        .catch((err) => {
          res.status(500).json({ error: err.message });
        });
      })

      // if user doesn't exist in DB (promise failed to return)
      // change this to a better message
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });

  // Render Login Page:
  router.get("/login", (req, res) => {
    // TO ADD: Check if session cookie exists, render urls_index instead
    res.render("../views/urls_login")
  });


  router.post('/login', (req, res) => {
    const {email, password} = req.body;

    // BEGIN moving contents of old login function inside the post request
    getUserByEmail(email)
    .then(res => {
      if (res.rows[0]) {
        // console.log('res.rows[0] from inside login function: ', res.rows[0]);
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
          // res.send({user: {name: user.name, email: user.email, id: user.id}});
          res.redirect("/")
        })
    .catch(err => console.error('query error', err.stack));
    // END moving contents of old login function inside the post request
  });

  return router;
};

