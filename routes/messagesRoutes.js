/*
 * All routes for messages are defined here
 * Since this file is loaded in server.js into api/messages,
 *   these routes are mounted onto /users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
*/

const express = require('express');
const router  = express.Router();
const { getUserByEmail, getVendorByEmail, getMessages } = require('./database');

module.exports = (db) => {

  router.get("/", (req, res) => {

    const user = req.session.user;
    if (!user) {
      const userEmail = user.email;
      res.render("../views/urls_messages", {userEmail});
    }
    const userID = user.id;
    res.redirect(`/messages/${userID}`);
  });

  router.get("/:user_id", (req, res) => {
    const user = req.session.user;
    // console.log("USER", user);
    const userEmail = user.email;
    const userID = user.id;
    const reply = {};
    let isVendor = false;

    getUserByEmail(userEmail)
      .then(userData => {
        // helper function to retrieve products from DB
        getVendorByEmail(userEmail)
          .then(vendorData => {
            if (userData) {
              isVendor = false;
              getMessages(userID, isVendor)
                .then(data => {
                  const messages = data;

                  const uniqueConvos = [];

                  for (let i = 0; i < messages.length; i++) {
                    const element = messages[i];
                    if (!uniqueConvos.includes(element.vendor_id)) {
                      uniqueConvos.push(element.vendor_id);
                    }
                  }
                  // console.log("UNIQUE CONVOS AFTER FUNCTION: ", uniqueConvos);

                  let arrayofConvos = [];
                  for (const u of uniqueConvos) {
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

                  res.render("../views/urls_messages", { messages, reply, userID, userEmail, arrayofConvos, uniqueConvos, isVendor });
                })
                .catch(err => {
                  res
                    .status(500)
                    .json({ error: err.message });
                });
            } else if (vendorData) {
              isVendor = true;
              getMessages(userID, isVendor)
            }

          })
          .catch((err) => {
            res.status(500).json({ error: err.message });
          });


      });


  });

  router.post("/:user_id", (req, res) => {
    const user = req.session.user;
    const userID = user.id;
    const userEmail = user.email;

    console.log("POST REQUEST: USER: ", user)

    if (!req.body.text) {
      res.status(400).json({ error: 'invalid request: no data in POST body'});
      return;
    }

    getUserByEmail(userEmail)
    .then(userData => {
        // helper function to retrieve products from DB
        getVendorByEmail(userEmail)
        .then(vendorData => {
        })
        // -----------------------------------TO DO: BUG! CURRENTLY TRYING TO SEND AN ERROR BEFORE REGISTERING NEW USER
      .catch(e => res.send(e));
    });



    const reply = {
      text: req.body.text,
      vendor_id: req.body.vendor_id,
      userID
    };

    return db.query(`
    INSERT INTO messages
    (user_id, vendor_id, message, is_vendor)
    VALUES
    ($1, $2, $3, $4)
    `, [userID, reply.vendor_id, reply.text, false])
      .then(data => {
        const messages = data.rows;
        return res.redirect(`/messages/${userID}`);
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });



  });

  return router;
};
