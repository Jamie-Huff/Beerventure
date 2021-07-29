const express = require('express');
const router  = express.Router();


const { toggleSoldStatus, toggleFeaturedStatus, deleteProduct, getItemObject } = require('./database');

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
      return res.render('urls_product', templateVars)
    })
    .catch(err => {
      return res
        .status(500)
        .json({ error: err.message });
    });
  })



  // ---------------------------------------------- POST (Item Management for Vendors)

  // ----------- Toggle item 'For Sale' status
  router.post('/item_sale_status', (req, res) => {
    const vendor = req.session.user;
    const responseObject = req.body;
    const itemId = Number(Object.keys(responseObject)[0]);

    // check cookie to see if user is a vendor (workaround since ejs logic isn't working)
    if (vendor.vendor) {
      // db call to get item object
      getItemObject(itemId)
        .then(result => {
          console.log('result: ', result);
          console.log('result.sold: ', result.sold);

          let newStatus = result.sold ? false : true;

          console.log('newStatus line 57: ', newStatus);
          // db call to make item featured
          toggleSoldStatus(itemId, newStatus)
          .then(after => {
            // refresh the page they're on
            return res.redirect('/vendors/');
          })
        })
      .catch(e => console.error({e: e.error }));
    } else {
      // user is not authorized to delete
      return res.status(403).json("not authorized. you are not a vendor");
    }
  })


  // ----------- Toggle an item's 'featured' status 
  router.post('/featured_status', (req, res) => {
    const vendor = req.session.user;
    const responseObject = req.body;
    const itemId = Number(Object.keys(responseObject)[0]);

    // check cookie to see if user is a vendor (workaround since ejs logic isn't working)
    if (vendor.vendor) {
      // db call to get item object
      getItemObject(itemId)
        .then(result => {
          console.log('result: ', result);

          let newStatus = result.featured ? false : true;

          console.log('newStatus line 89: ', newStatus);
          // db call to make item featured
          toggleFeaturedStatus(itemId, newStatus)
          .then(after => {
            // refresh the page they're on
            return res.redirect('/vendors/');
          })
        })
      .catch(e => console.error({e: e.error }));
    } else {
      // user is not authorized to delete
      return res.status(403).json("not authorized. you are not a vendor");
    }
  })


  // ----------- Delete an item from database
  router.post('/delete_item', (req, res) => {
    const vendor = req.session.user;
    const responseObject = req.body;
    const itemId = Object.keys(responseObject)[0];
    console.log('itemId: ', itemId);
    console.log('typeof itemId: ', typeof itemId);

    // check cookie to see if user is a vendor (workaround since ejs logic isn't working)
    if (vendor.vendor) {
      // db call to delete item
      deleteProduct(itemId)
      .then(result => {
        // Take the vendor back to their profile page
        return res.redirect('/vendors');
      })
      .catch(e => console.error({e: e.error }));
    } else {
      // user is not authorized to delete
      return res.status(403).json("not authorized. you are not a vendor");
    }
  })



  return router
}
