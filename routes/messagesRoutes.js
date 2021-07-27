/*
 * All routes for messages are defined here
 * Since this file is loaded in server.js into api/messages,
 *   these routes are mounted onto /users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router  = express.Router();
const { getMessages } = require('./database')

module.exports = (db) => {
  console.log(db)

  router.get("/", (req, res) => {

    getMessages()
      .then(results => {
        const messages = results
        return res.render("../views/urls_messages", { messages })
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });

  // router.post()


  // router.get("/", (req, res) => {
  //   db.query(`
  //   SELECT messages.*, vendors.name as name
  //   FROM messages
  //   JOIN vendors ON vendor_id = vendors.id
  //   ORDER BY vendor_id;
  //   `)
  //   .then(data => {
  //     const users = data.rows;
  //     res.json({ users });
  //     return res.render("../views/urls_messages", { users })
  //   })
  //   .catch(err => {
  //     res
  //       .status(500)
  //       .json({ error: err.message });
  //   });
  // });


  return router;
};


