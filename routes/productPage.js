const express = require('express');
const router  = express.Router();

module.exports = (db) => {
 router.get(`/:productURL`, (req, res) => {
    const user = req.session.user
    let value = req.params.productURL.split('&')
    console.log(user)
    const productName = value[0].substr(1, value[0].length)
    const itemId = value[1].substr(7)
    const query = (`SELECT *
    FROM items
    WHERE id = $1
    ;`)

    return db.query(query, [itemId])
    .then(value => {
      let templateVars = {}
      if (!user) {
        templateVars = {
          userObject: null,
          items: value.rows
        }
      } else {
        templateVars = {
          userObject: user,
          items: value.rows
        }
      }
      console.log(templateVars)
      res.render('urls_product', templateVars)
    })
    .catch(err => {
      res
        .status(500)
        .json({ error: err.message });
    });
  })
  return router
}
