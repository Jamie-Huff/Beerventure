/*
 * All routes for messages are defined here
 * Since this file is loaded in server.js into api/messages,
 *   these routes are mounted onto /users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
*/

const express = require('express');
const router  = express.Router();
const { getUserByEmail, getVendorByEmail, getMessages, addMessages } = require('./database');

module.exports = (db) => {

  router.get("/:user_id", (req, res) => {
    const user = req.session.user;
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
                .then(data => {
                  const messages = data;
                  // console.log("MESSAGES: ", messages)

                  const uniqueConvos = [];

                  for (let i = 0; i < messages.length; i++) {
                    const element = messages[i];
                    if (!uniqueConvos.includes(element.user_id)) {
                      uniqueConvos.push(element.user_id);
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
                      if (item.user_id == uniqueConvos[i]) {
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

            }

          })
          .catch((err) => {
            res.status(500).json({ error: err.message });
          });


      });


  });

  router.get("/", (req, res) => {

    const user = req.session.user;
    if (!user) {
      const userEmail = user.email;
      res.render("../views/urls_messages", {userEmail});
    }
    const userID = user.id;
    res.redirect(`/messages/${userID}`);
  });

  router.post("/:user_id", (req, res) => {
    const user = req.session.user;
    const userID = user.id;
    const userEmail = user.email;
    isVendor = false;
    // console.log("TEST REQ BODY @#$@#$", req.body);
    // console.log("POST REQUEST: USER: ", user)

    if (!req.body.text) {
      res.status(400).json({ error: 'invalid request: no data in POST body'});
      return;
    }

    console.log("REQ BODY: ", req.body)

    getUserByEmail(userEmail)
    .then(userData => {
        // helper function to retrieve products from DB
        getVendorByEmail(userEmail)
        .then(vendorData => {

          if (userData) {
            isVendor = false;
            const reply = {
              text: req.body.text,
              vendor_id: req.body.vendor_id,
              userID
            };
            addMessages([userID, reply.vendor_id, reply.text, isVendor])
            .then(data => {
              return res.redirect(`/messages/${userID}`);
            })
            .catch(err => {
              res
                .status(500)
                .json({ error: err.message });
            });

          } else if (vendorData) {
            isVendor = true;
            const reply = {
              text: req.body.text,
              user_id: req.body.user_id,
              userID
            };

            addMessages([reply.user_id, userID, reply.text, isVendor])
            .then(data => {
              return res.redirect(`/messages/${userID}`);
            })
            .catch(err => {
              res
                .status(500)
                .json({ error: err.message });
            });
          }

        })
      .catch(e => res.send(e));
    });
  });

  return router;
};
