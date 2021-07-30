const express = require('express');
const router  = express.Router();
const {
  getUserFavourites,
  unFavouriteItem,
  addFavouriteItem
} = require('./database');



module.exports = (db) => {

  // ---------------------------------------------- PRODUCT LOAD PAGE
  router.get('/', (req, res) => {
    // get user cookie if exists
    const user = req.session.user;

    if (user) {
      // user is logged in
      getUserFavourites(user.id)
        .then(data => {
          const templateVars = {
            userObject: user,
            favourites: data
          };
          return res.render("../views/urls_favourites", templateVars)
        })
        .catch(err => console.error('error', err.stack))
    } else {
      // user is not logged in
      return res.redirect('/login');
    }
  })


  // ----------------------------------------------------------------- REMOVE FAVOURITED ITEM
  router.post('/', (req, res) => {
    // favouriteId = the fav id of our table
    console.log(req.session)
    let favouriteId = req.body
    console.log(favouriteId)
    favouriteId = JSON.stringify(favouriteId)
    favouriteId = favouriteId.substring(1, favouriteId.length - 1)
    favouriteId = favouriteId.split(':')[0]
    favouriteId = JSON.parse(favouriteId)
    favouriteId = Number(favouriteId)

    // get user cookie if exists
    const user = req.session.user;

    if (user) {
      // user is logged in
      unFavouriteItem(favouriteId)
      .then (data => {
        return res.redirect('/favourites')
        .catch(err => console.error('error', err.stack))
      })
    } else {
      // user is not logged in
      return res.redirect('/login');
    }
  })


  // ----------------------------------------------------------------- ADD FAVOURITE ITEM
  router.post('/add', (req, res) => {
    console.log('this happened')
    console.log('nice dog>>>>', req.session.user)
    // favouriteId = the fav id of our table
    console.log(req.body)
    let favouriteId = req.body
    console.log('this happened: 1')
    favouriteId = JSON.stringify(favouriteId)
    console.log('this happened: 2')
    favouriteId = favouriteId.substring(1, favouriteId.length - 1)
    console.log('this happened: 3')
    favouriteId = favouriteId.split(':')[0]
    console.log('this happened: 4')
    favouriteId = JSON.parse(favouriteId)
    console.log('this happened: 5')
    favouriteId = Number(favouriteId)
    console.log('this happened: 6')
    // get user cookie if exists
    const user = req.session.user;

    if (user) {
      // user is logged in:
      addFavouriteItem(favouriteId, user.id)
        .then (data => {
          console.log(data);
          return res.redirect('/favourites')
        })
        .catch(err => console.error('error', err.stack))
    } else {
      // user is not logged in
      return res.redirect('/login');
    }
  })

  return router;
};

