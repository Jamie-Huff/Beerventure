const express = require('express');
const router  = express.Router();


const { toggleProductStatus, deleteProduct } = require('./database');

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
      console.log('templateVars: ', templateVars);
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
    const itemId = req.params.productURL;
    console.log('itemId to toggle: ', itemId);

    // check cookie to see if user is a vendor (workaround since ejs logic isn't working)
    if (vendor.vendor) {

      // db call to make item featured
      toggleProductStatus(itemId)
      .then(res => {
        // refresh the page they're on
        return res.redirect('/item_sale_status/:productID');
      })
      .catch(e => console.log({e: e.error }));
      
    } else {
      // user is not authorized to delete
      return res.status(403).json("not authorized. you are not a vendor");
    }
    
  })


  // ----------- Toggle an item's 'featured' status off
  router.post('/featured_status/off', (req, res) => {
    const vendor = req.session.user;
    const responseObject = req.body;
    const itemId = Object.keys(responseObject)[0];
    console.log('itemId: ', itemId);
    console.log('typeof itemId: ', typeof itemId);

    // check cookie to see if user is a vendor (workaround since ejs logic isn't working)
    if (vendor.vendor) {
      // db call to make item featured
      toggleProductStatus(itemId)
      .then(res => {
        // refresh the page they're on
        return res.redirect(`/item_sale_status/${itemId}`);
      })
      .catch(e => console.log({e: e.error }));
      
    } else {
      // user is not authorized to delete
      return res.status(403).json("not authorized. you are not a vendor");
    }
    
  })


    // ----------- Toggle an item's 'featured' status on
    router.post('/featured_status/off', (req, res) => {
      const vendor = req.session.user;
      const responseObject = req.body;
      const itemId = Object.keys(responseObject)[0];
      console.log('itemId: ', itemId);
      console.log('typeof itemId: ', typeof itemId);
  
      // check cookie to see if user is a vendor (workaround since ejs logic isn't working)
      if (vendor.vendor) {
        // db call to make item featured
        toggleProductStatus(itemId)
        .then(res => {
          // refresh the page they're on
          return res.redirect(`/item_sale_status/${itemId}`);
        })
        .catch(e => console.log({e: e.error }));
        
      } else {
        // user is not authorized to delete
        return res.status(403).json("not authorized. you are not a vendor");
      }
      
    })

  // ----------- Delete an item from database


  // For deleting an item
  router.post('/delete_item', (req, res) => {
    const vendor = req.session.user;
    const itemId = req.params.productURL;
    console.log('itemId to delete: ', itemId);

    // check cookie to see if user is a vendor (workaround since ejs logic isn't working)
    if (vendor.vendor) {

      // db call to delete item
      deleteProduct(itemId)
      .then(res => {
        // Take the vendor back to their profile page
        return res.redirect('/vendors');
      })
      .catch(e => console.log({e: e.error }));
      
    } else {
      // user is not authorized to delete
      return res.status(403).json("not authorized. you are not a vendor");
    }

  })



  return router
}
