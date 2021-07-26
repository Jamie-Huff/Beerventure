const express = require('express');
const router  = express.Router();

module.exports = (db) => {
  router.get("/", (req, res) => {
    let query = `SELECT * FROM items_for_sale`;
    return db.query(query)
      .then(data => {
        res.render("urls_search")
        const items = data.rows;
        return res.json({ items });
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });
  return router;
};

