/*
 * All routes for messages are defined here
 * Since this file is loaded in server.js into api/messages,
 *   these routes are mounted onto /users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
*/

const express = require('express');
const router  = express.Router();
const { getUserByEmail, getVendorByEmail } = require('./database');

module.exports = (db) => {

  router.get("/", (req, res) => {

    const user = req.session.user;
    if (!user) {
      const userEmail = user.email;
      res.render("../views/urls_messages", {userEmail})
    }
    const userID = user.id;
    res.redirect(`/messages/${userID}`);
  })

  router.get("/:user_id", (req, res) => {
    const user = req.session.user;
    const userEmail = user.email;
    const userID = user.id;

    // getUserByEmail(user_id)
    // .then (userInfo => {
    //   getVendorByEmail(userInfo.email)
    //   .then(vendorInfo => {
    //     if (userInfo | vendorInfo) {
    //       console.log(userInfo)
    //       console.log(vendorInfo)

    //     }
    //   })
    // })


    const reply = {}
    return db.query(`
    SELECT messages.*, vendors.name as name
    FROM messages
    JOIN vendors ON vendor_id = vendors.id
    WHERE user_id = $1
    ORDER BY vendor_id;
    `, [userID])
    .then(data => {
      const messages = data.rows;
      console.log("MESSAGES: ", messages)
      // const exists = [];
      // const messageList = [];
      // for (let i = 0; i < messages.length; i++) {
      //   if (!exists.includes(element.vendor_id)) {
      //     if (messageList.length < 1) {
      //       messageList.push([])
      //     }
      //     messageList.push(element);
      //     exists.push(element.vendor_id);
      //   }
      // }
      // console.log("MESSAGELIST: ", messageList);
      // console.log("EXISTS: ", exists);

      const uniqueConvos = [];

      for(let i = 0; i < messages.length; i++) {
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
  });

  router.post("/:user_id", (req, res) => {
    const user = req.session.user;

    console.log(req.body)

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



  });

  return router;
};
