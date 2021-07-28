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

      /* This works but maybe I don't want to use it
      const vendorMessages = getVendorMessages(vendor.id);


      (async() => {
        // everything i need to do with the vendor messages
        await vendorMessages;
        // ajax thing:
        // for (const message of vendorMessages) {
        //   console.log('message: ', message);
        // }

        console.log('vendorMessages: ', vendorMessages);


      })()
      */

      getVendorMessages(vendor.id)
        .then((err, messages) => {
          if (err) {
            res.status(500).json({ error: err.message });
          } else {
            res.json(messages);
          }
        })

      


      tweetsRoutes.post("/", function(req, res) {
        if (!req.body.text) {
          res.status(400).json({ error: 'invalid request: no data in POST body'});
          return;
        }
    
        const user = req.body.user ? req.body.user : userHelper.generateRandomUser();
        const tweet = {
          user: user,
          content: {
            text: req.body.text
          },
          created_at: Date.now()
        };
    
        DataHelpers.saveTweet(tweet, (err) => {
          if (err) {
            res.status(500).json({ error: err.message });
          } else {
            res.status(201).send();
          }
        });
      });


      

      






























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
    isVendor = false;
    console.log("TEST REQ BODY @#$@#$", req.body);
    // console.log("POST REQUEST: USER: ", user)

    if (!req.body.text) {
      res.status(400).json({ error: 'invalid request: no data in POST body'});
      return;
    }

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
          }

    */
  });

  return router;
};
