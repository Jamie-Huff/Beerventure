const { request } = require('express');
const express = require('express');
const router  = express.Router();

module.exports = (db) => {
  router.get("/", (req, res) => {
    let user = req.session.user
    let query = `
    SELECT price, items.name, category, vendors.city as city, date_posted, image, vendors.name as vendor
    FROM items
    JOIN vendors ON vendors.id = vendor_id
    `;
    return db.query(query)
      .then(data => {
        let templateVars;
        const items = data.rows;
        if (user) {
          templateVars = {
            items,
            userObject: user,
            city: null
          }
        } else {
          templateVars = {
          items,
          userObject: null,
          city: null
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

  router.get("/searchByCity", (req, res) => {
    let user = req.session.user
    const city = req.query.city
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
            userObject: user,
            city,
          }
        } else {
          templateVars = {
          items,
          userObject: null,
          city,
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


    router.get("/lowToHigh", (req, res) => {
      console.log(req.query)
      let user = req.session.user
      const city = req.query.city
      let query = `
      SELECT price, items.name, category, vendors.city as city, date_posted, image, vendors.name as vendor
      FROM items
      JOIN vendors ON vendors.id = vendor_id
      WHERE city = $1
      ORDER BY price;
      `
      return db.query(query, [city])
        .then(data => {
          let templateVars;
          const items = data.rows;
          if (user) {
            templateVars = {
              items,
              userObject: user,
              city,
            }
          } else {
            templateVars = {
            items,
            userObject: null,
            city,
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

      router.get("/highToLow", (req, res) => {
        console.log(req.query)
        let user = req.session.user
        const city = req.query.city
        let query = `
        SELECT price, items.name, category, vendors.city as city, date_posted, image, vendors.name as vendor
        FROM items
        JOIN vendors ON vendors.id = vendor_id
        WHERE city = $1
        ORDER BY price DESC;
        `
        return db.query(query, [city])
          .then(data => {
            let templateVars;
            const items = data.rows;
            if (user) {
              templateVars = {
                items,
                userObject: user,
                city,
              }
            } else {
              templateVars = {
              items,
              userObject: null,
              city,
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

