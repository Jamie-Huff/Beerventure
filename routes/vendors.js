const express = require('express');
const router  = express.Router();

module.exports = (db) => {
  router.get("/", (req, res) => {
    let query = `SELECT * FROM vendors`;
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

  router.post("/", (req, res) => {
    console.log(req.body)
    const city = req.body.city
    let query = `SELECT city FROM vendors WHERE city = $1`
    console.log(city)
    return db.query(query, [city])
      .then(data => {
        const items = data.rows;
        console.log(items)
        return res.json({ items });
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
    })
  return router;
};

