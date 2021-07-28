const express = require('express');
const router  = express.Router();

module.exports = (db) => {
  router.get("/", (req, res) => {
    let user = req.session.user
    let query = `SELECT * FROM items`;
    return db.query(query)
      .then(data => {
        let templateVars;
        const items = data.rows;
        if (user) {
          templateVars = {
            items,
            userObject: user
          }
        } else {
          templateVars = {
          items,
          userObject: null
          }
        }

        res.render("urls_search", templateVars)

      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });

  router.post("/", (req, res) => {
    let user = req.session.user
    const city = req.body.city
    let query = `
    SELECT price, items.name, category, vendors.city as city, date_posted, image, vendors.name as vendor
    FROM items
    JOIN vendors ON vendors.id = vendor_id
    WHERE city = $1
    `
    return db.query(query, [city])
      .then(data => {
        let templateVars;
        const items = data.rows;
        if (user) {
          templateVars = {
            items,
            userObject: user
          }
        } else {
          templateVars = {
          items,
          userObject: null
          }
        }

        res.render('urls_search', templateVars)
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
    })
  return router;
};

