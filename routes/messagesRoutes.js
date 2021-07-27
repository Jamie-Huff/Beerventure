/*
 * All routes for messages are defined here
 * Since this file is loaded in server.js into api/messages,
 *   these routes are mounted onto /users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router  = express.Router();

module.exports = (db) => {
  // console.log(db)

  router.get("/:user_id", (req, res) => {
    const user_id = req.params.user_id
    const reply = {}
    return db.query(`
    SELECT messages.*, vendors.name as name
    FROM messages
    JOIN vendors ON vendor_id = vendors.id
    WHERE user_id = $1
    ORDER BY vendor_id;
    `, [user_id])
    .then(data => {
      const messages = data.rows;
      console.log(messages);
      res.render("../views/urls_messages", { messages, reply, user_id })
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
      // console.log(messages);
      return res.redirect(`/messages/${user_id}`)
      // res.render("../views/urls_messages", { messages, reply, user_id })
    })
    .catch(err => {
      res
        .status(500)
        .json({ error: err.message });
    });



  });

  return router;
};
