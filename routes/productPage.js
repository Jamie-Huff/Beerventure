const express = require('express');
const router  = express.Router();

module.exports = (db) => {
 router.get(`/:productURL`, (req, res) => {
    userId = req.session.user
    let value = req.params.productURL.split('&')
    const productName = value[0].substr(1, value[0].length)
    const itemId = value[1].substr(7)
    const query = (`SELECT *
    FROM items
    WHERE id = $1
    ;`)
    return db.query(query, [itemId])
    .then(value => {
      let templateVars = {userId, items: value.rows}
      console.log(templateVars)
      res.render('urls_product', templateVars)
    })
  })
  return router
}
