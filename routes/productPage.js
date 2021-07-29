const express = require('express');
const router  = express.Router();

module.exports = (db) => {
  router.get(`/:productURL`, (req, res) => {
    const user = req.session.user
    let value = req.params.productURL.split('&')
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
      // console.log('templateVars: ', templateVars);
      res.render('urls_product', templateVars)
    })
    .catch(err => {
      res
        .status(500)
        .json({ error: err.message });
    });
  })

  // ---------------------------------------------- POST (Item Management for Vendors)
  // For toggling the on sale status of an item
  router.post('/item_sale_status/:productID', (req, res) => {
    const itemId = req.params.productURL;
    console.log('itemId to toggle: ', itemId);

    
  })


  // FIGURE OUT THIS LOGIC AND FIX THE ACTION LINKS FOR THE FORM
  
  // this ejs logic in the urls_product.ejs file wasn't working. I'm not sure why:
  // <% if (userObject[vendor]) { %>
  // <p>Currently <%= items[0].sold ? 'On Sale' : 'Sold Out' %></p>
  // <% } %>
  // <%= I don't know why my EJS logic isn't working for making this only appear when the user is a vendor %>
  // <%= Currently it's appearing for everyone %>


  // For deleting an item
  router.post('/delete_item/:productID', (req, res) => {
    //
    const itemId = req.params.productURL;
    console.log('itemId to delete: ', itemId);


  })



  return router
}
