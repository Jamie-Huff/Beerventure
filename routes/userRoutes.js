const express = require('express');
const { getUserWithEmail, getUserByEmail } = require('./database');
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
    // get userObject from database, based on user email from session cookie
    const userDBObject = getUserByEmail(userEmail);
    // console.log('userDBObject: ', userDBObject);

    userDBObject
      .then(data => {

        // if user does exist in DB but password doesn't match (data === null)
        // or if page is loaded with no existing session cookie (data === null since userEmail = undefined)
        if (!data) {
          return res.render("../views/urls_index")
        }

        // if user does exist in DB and password matches (data === userDBObject)
        if (data) {
          console.log('here on 45');
          const templateVars = {
            userDBObject
          }
          return res.render("../views/urls_index", templateVars)
        }
      })

      // if user doesn't exist in DB (promise failed to return)
      // change this to a better message
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message })
      })
  });

  // Render Login Page:
  router.get("/login", (req, res) => {
    // const userEmail = req.session.user_id;
    // db.query(`SELECT * FROM users WHERE email = $1;`, [email])
    // .then(res => {
    //   if (res.rows[0]) {
    //     console.log('here at 53');
    //     console.log('res.rows[0] from inside login function: ', res.rows[0]);
    //     return res.rows[0]
    //   }
    //   return null
    // })
    // give error message and render
    res.render("../views/urls_login")
  });


  router.post('/login', (req, res) => {
    // console.log(req.body);

    const {email, password} = req.body;

    // BEGIN moving contents of old login function inside the post request
    db.query(`SELECT * FROM users WHERE email = $1;`, [email])
    .then(res => {
      if (res.rows[0]) {
        console.log('here at 53');
        console.log('res.rows[0] from inside login function: ', res.rows[0]);
        return res.rows[0]
      }
      return null
    })
    .then(user => {
          if (!user) {
            res.send({error: "error"});
            return;
          }
          console.log('here at 64');
          req.session.userId = user.id;
          // res.send({user: {name: user.name, email: user.email, id: user.id}});
          res.redirect("/")
        })
    .catch(err => console.error('query error', err.stack));
    // END moving contents of old login function inside the post request


        // OLD METHOD - DIDN'T WORK ASYNC
    // login(email, password)
    //   .then(res => console.log('res result line 49: ', res))
    // console.log('result of login: ', login(email, password));

    // login(email, password)
    //   .then(res => console.log('res from inside post request: ', res))
    //   .then(user => {
    //     if (!user) {
    //       res.send({error: "error"});
    //       return;
    //     }
    //     console.log('here');
    //     req.session.userId = user.id;
    //     res.send({user: {name: user.name, email: user.email, id: user.id}});
    //   })
    //   .catch(e => res.send(e));
  });





  return router;
};

