/*
 * All routes for messages are defined here
 * Since this file is loaded in server.js into api/messages,
 *   these routes are mounted onto /users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router  = express.Router();

module.exports = (db) => {
  console.log(db)

  router.get("/", (req, res) => {
    return db.query(`
    SELECT messages.*, vendors.name as name
    FROM messages
    JOIN vendors ON vendor_id = vendors.id
    ORDER BY vendor_id;
    `)
    .then(data => {
      const messages = data.rows;
      res.render("../views/urls_messages", { messages });
    })
    .catch(err => {
      res
        .status(500)
        .json({ error: err.message });
    });
  });

  // router.post("/:userid", (req, res) => {
  //   .then((queryResults) => {
  //     res.json(queryResults.rows[0])
  //   })
  // });

  return router;
};


