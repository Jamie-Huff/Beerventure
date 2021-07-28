/*
 * All routes for messages are defined here
 * Since this file is loaded in server.js into api/messages,
 *   these routes are mounted onto /users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
*/

const express = require('express');
const router  = express.Router();
const { getUserByEmail, getVendorByEmail } = require('./database');

// const uniqueConvoForUsers = function(arrayOfObjects, uniqueConvos) {
//   //create an empty array to keep track of unique vendors

//   //loop through each item in messages
//     for(let i = 0; i < messages.length; i++) {
//       //isolating each element in array for easier read
//       const element = messages[i];
//       //if the vendorID doesn't exist in this empty array
//       if (!uniqueConvos.includes(element.vendor_id)) {
//         //adds
//         uniqueConvos.push(element.vendor_id);
//       }
//     }
//   //should return an array with vendor ID's
//   return uniqueConvos
// }



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
      const uniqueConvos = [];

      //loop through each item in messages
      for(let i = 0; i < messages.length; i++) {
        //isolating each element in array for easier read
        const element = messages[i];
        //if the vendorID doesn't exist in this empty array
        if (!uniqueConvos.includes(element.vendor_id)) {
          //adds
          uniqueConvos.push(element.vendor_id);
        }
      }

      console.log("UNIQUE CONVOS AFTER FUNCTION: ", uniqueConvos);

      let arrayofConvos = [];

      console.log("ARRAYOFCONVOS: ", arrayofConvos)

      for (let i = 0; i < uniqueConvos.length; i++) {
        for (const item of messages) {
          if (item.vendor_id == uniqueConvos[i]) {
            if (arrayofConvos.length < 1){
              arrayofConvos.push([]);
              console.log("TESTING INSIDE: ", arrayofConvos[i]);
              arrayofConvos[i].push(item);
            }
            else {
              arrayofConvos[i].push(item);
            }
          }
        }
      }

      console.log("ARRAY OF CONVOS FIRST ELEMENT AFTER: ", arrayofConvos[0])


      res.render("../views/urls_messages", { messages: messageList, reply, userID, userEmail })
    })
    .catch(err => {
      res
        .status(500)
        .json({ error: err.message });
    });
  });

  router.post("/:user_id", (req, res) => {
    const user_id = req.params.user_id

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







