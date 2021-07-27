const express = require('express');
const router  = express.Router();

module.exports = (db) => {
  router.get("/", (req, res) => {
    let query = `SELECT * FROM items`;
    return db.query(query)
      .then(data => {
        const items = data.rows;
        res.render("urls_search", {items})

        // return res.json({ items });
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });

  router.post("/", (req, res) => {
    console.log(req.body)
    const city = req.body.city
    let query = `
    SELECT price, items.name, category, vendors.city as city, date_posted, image, vendors.name as vendor
    FROM items
    JOIN vendors ON vendors.id = vendor_id
    WHERE city = $1
    `
    return db.query(query, [city])
      .then(data => {

        const items = data.rows;
        res.render('urls_search', {items})
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
    })
  return router;
};

