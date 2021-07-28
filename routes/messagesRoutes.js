/*
 * All routes for messages are defined here
 * Since this file is loaded in server.js into api/messages,
 *   these routes are mounted onto /users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
*/

const express = require('express');
const router  = express.Router();
const { getUserByEmail, getVendorByEmail, getVendorMessages, getUserMessages } = require('./database');

module.exports = (db) => {

  router.get("/", (req, res) => {
    // get user cookie (all users need a cookie to be signed in to access the page)
    const user = req.session.user;
    // if no cookie, push them to login
    if (!user) {
      return res.status(403).json({ error: "not authorized"});
      // could just boot them to login page instead?
      return res.render("../views/urls_login")
    }



    // if user is a vendor (session cookie has vendor: true)
    if (user.vendor) {
      // just so i don't get confused:
      const vendor = user;
      // Get all the messages from the database where messages.vendor_id = vendor.id
      getVendorMessages(vendor.id)
        .then(res => {
          console.log(res);
        })
        .catch(e => res.send(e))

      






























    } else {
      // user is not a vendor, they are a user
    }







































    /*
    const user = req.session.user;
    if (!user) {
      res.render("../views/login", {userEmail})
    }
    const userID = user.id;
    res.redirect(`/messages/${userID}`);
  })

  router.get("/:user_id", (req, res) => {
    const user = req.session.user;
    // console.log("USER", user);
    const userEmail = user.email;
    const userID = user.id;
    const reply = {}
    let isVendor = false;
    let me, them;


    getUserByEmail(userEmail)
    .then(userData => {
        // helper function to retrieve products from DB
        getVendorByEmail(userEmail)
        .then(vendorData => {
          // -----------------------------------TO DO: should be updated to better output (failure message)
          if (userData) {
            isVendor = false;
            me = user_id,
            them = vendor_id;
            getMessages([userID, me, them])
            .then ()
          } else {

          }




        })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      })




    getUserByEmail(userEmail)
    .then (userInfo => {
      console.log("USER INFO FROM GET USER EMAIL: ", userInfo)


      return db.query(`
      SELECT messages.*, vendors.name as name
      FROM messages
      JOIN vendors ON vendor_id = vendors.id
      WHERE $2 = $1
      ORDER BY $3;
      `, [userID, me, them])
      .then(data => {
        const messages = data.rows;

        const uniqueConvos = [];

        for (let i = 0; i < messages.length; i++) {
          const element = messages[i];
          if (!uniqueConvos.includes(element.vendor_id)) {
            uniqueConvos.push(element.vendor_id);
          }
        }
        // console.log("UNIQUE CONVOS AFTER FUNCTION: ", uniqueConvos);

        let arrayofConvos = [];
        for(const u of uniqueConvos) {
          arrayofConvos.push([]);
        }
        // console.log("ARRAYOFCONVOS: ", arrayofConvos)

        for (let i = 0; i < uniqueConvos.length; i++) {
          for (const item of messages) {
            if (item.vendor_id == uniqueConvos[i]) {
              arrayofConvos[i].push(item);
            }
          }
        }
        // console.log("ARRAY OF CONVOS ALL: ", arrayofConvos)
        // console.log("ARRAY OF CONVOS ARRAY 1: ", arrayofConvos[0])
        // console.log("ARRAY OF CONVOS ARRAY 2: ", arrayofConvos[1])

        res.render("../views/urls_messages", { messages, reply, userID, userEmail, arrayofConvos, uniqueConvos })
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });


    })


  });

  router.post("/:user_id", (req, res) => {
    const user = req.session.user;

    // console.log(req.body)

    if (!req.body.text) {
      res.status(400).json({ error: 'invalid request: no data in POST body'});
      return;
    }

    const reply = {
      text: req.body.text,
      vendor_id: req.body.vendor_id,
      user_id
    }

    return db.query(`
    INSERT INTO messages
    (user_id, vendor_id, message)
    VALUES
    ($1, $2, $3)
    `, [user_id, reply.vendor_id, reply.text])
    .then(data => {
      const messages = data.rows;
      return res.redirect(`/messages/${user_id}`)
    })
    .catch(err => {
      res
        .status(500)
        .json({ error: err.message });
    });



    */
  });

  return router;
};
