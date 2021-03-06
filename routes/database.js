/*

This file contains all queries to the database.
It uses node-postgres 'require('pg')'
Documentation: https://node-postgres.com/

*/

const { Pool } = require('pg');
const dbParams = require('../lib/db.js');

const pool = new Pool(dbParams);


pool.connect().then(() => {
  console.log("Connected");
}).catch(e => {
  console.log(e.message);
});



// ----------------------------------------------------- Users

const getUserByEmail = function(email) {
  return pool
    .query(`SELECT * FROM users WHERE email = $1;`, [email])
    .then(res => res.rows[0] ? res.rows[0] : null)
    .catch(err => console.error('query error', err.stack))
};
exports.getUserByEmail = getUserByEmail;


const addNewUser = function(user) {
  const values = [user.name, user.email, user.password, user.phone];
  return pool
    .query(`
    INSERT INTO users (name, email, password, phone_number)
    VALUES($1, $2, $3, $4)
    RETURNING *;
    `, values)
    .then(res => res.rows)
    .catch(err => console.error('query error', err.stack))
};
exports.addNewUser = addNewUser;

const getUserByName = function(name) {
  console.log("NAME:", name);
  const insertName = `%${name.slice(1)}%`
  console.log("INSERT NAME: ", insertName)
  return pool
  .query(`SELECT * FROM users WHERE name LIKE $1`, [insertName])
  .then(res => res.rows[0] ? res.rows[0] : null)
  .catch(err => console.error('query error', err.stack))
}
exports.getUserByName = getUserByName;


// ----------------------------------------------------- Vendors

// We could combine this with getUserByEmail and just JOIN tables, search both for a match?
const getVendorByEmail = function(email) {
  return pool
    .query(`SELECT * FROM vendors WHERE email = $1;`, [email])
    .then(res => res.rows[0] ? res.rows[0] : null)
    .catch(err => console.error('query error', err.stack))
};
exports.getVendorByEmail = getVendorByEmail;

const addNewVendor = function(vendor) {
  const values = [vendor.name, vendor.email, vendor.password, vendor.city, vendor.postal_code, vendor.phone, vendor.website, vendor.description];
  return pool
    .query(`
    INSERT INTO vendors (name, email, password, city, postal_code, phone_number, website_url, vendor_description)
    VALUES($1, $2, $3, $4, $5, $6, $7, $8)
    RETURNING *;
    `, values)
    .then(res => res.rows)
    .catch(err => console.error('query error', err.stack))
};
exports.addNewVendor = addNewVendor;

const getVendorByName = function(name) {
  console.log("NAME:", name);
  const insertName = `%${name.slice(1)}%`
  console.log("INSERT NAME: ", insertName)
  return pool
  .query(`SELECT * FROM vendors WHERE name LIKE $1`, [insertName])
  .then(res => res.rows[0] ? res.rows[0] : null)
  .catch(err => console.error('query error', err.stack))
}
exports.getVendorByName = getVendorByName;

// ----------------------------------------------------- Products

const getFeaturedProducts = function() {
  // Make this modular so 3 different sets of products are returned for different user types?
  return pool
    .query(`
      SELECT items.*, vendors.name as vendor_name
      FROM items
      JOIN vendors ON vendors.id = vendor_id
      WHERE featured=TRUE`)
    .then(res => res.rows ? res.rows : null)
    .catch(err => console.error('query error', err.stack))
}
exports.getFeaturedProducts = getFeaturedProducts;



// Products from only one vendor
const getVendorsProducts = function(email) {
  return pool
    .query(`SELECT items.*
      FROM items
      JOIN vendors ON vendor_id = vendors.id
      WHERE vendors.email=$1`, [email])
    .then(res => res.rows ? res.rows : null)
    .catch(err => console.error('query error', err.stack))
}
exports.getVendorsProducts = getVendorsProducts;


const addNewProduct = function(product) {
  const values = [
    product.name,
    product.description,
    product.price,
    product.vendor_id,
    product.featured,
    product.category,
    product.abv,
    product.mliter,
    product.image
  ];
  return pool
    .query(`
      INSERT INTO items (name, description, price, vendor_id, featured, category, abv, mliter, image)
      VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *;
    `, values)
    .then(res => res.rows)
    .catch(err => console.error('query error', err.stack))
};
exports.addNewProduct = addNewProduct;


const deleteProduct = function(itemId) {
  return pool
    .query(`DELETE FROM items WHERE $1 = items.id RETURNING *;`, [itemId])
    .then(res => res.rows)
    .catch(err => console.error('query error', err.stack))
};
exports.deleteProduct = deleteProduct;


const toggleSoldStatus = function(item, newStatus) {
    return pool
    .query(`UPDATE items SET sold = $2 WHERE items.id = $1 RETURNING *;`, [item, newStatus])
    .then(res => res.rows)
    .catch(err => console.error('query error', err.stack))
};
exports.toggleSoldStatus = toggleSoldStatus;


const toggleFeaturedStatus = function(item, newStatus) {
    return pool
    .query(`UPDATE items SET featured = $2 WHERE items.id = $1 RETURNING *;`, [item, newStatus])
    .then(res => res.rows)
    .catch(err => console.error('query error', err.stack))
};
exports.toggleFeaturedStatus = toggleFeaturedStatus;


const getItemObject = function(itemId) {
    return pool
    .query(`SELECT * FROM items WHERE items.id = $1;`, [itemId])
    .then(res => res.rows[0])
    .catch(err => console.error('query error', err.stack))
};
exports.getItemObject = getItemObject;


// ----------------------------------------------------- Products > Users's Favourite Items

const getUserFavourites = function(userId) {

  return pool
    .query(`SELECT items.id as item_id,
      items.name as item_name,
      vendors.name as vendor_name,
      items.price as item_price,
      items.category as item_category,
      items.image as item_image,
      favourites.id as favourite_id
      FROM items
      JOIN favourites ON items.id = favourites.item_id
      JOIN vendors ON vendors.id = items.vendor_id
      WHERE $1 = favourites.user_id;
    `, [userId])
    .then(res => res.rows)
    .catch(err => console.error('query error', err.stack))
};
exports.getUserFavourites = getUserFavourites;


const unFavouriteItem = function(favId) {
  return pool
    .query(`DELETE FROM favourites WHERE $1 = favourites.id;`, [favId])
    .then(res => res.rows)
    .catch(err => console.error('query error', err.stack))
};
exports.unFavouriteItem = unFavouriteItem;


const addFavouriteItem = function(favId, userId) {
  return pool
    .query(`INSERT INTO favourites (item_id, user_id) VALUES($1, $2) RETURNING *;`, [favId, userId])
    .then(res => res.rows)
    .catch(err => console.error('query error', err.stack))
};
exports.addFavouriteItem = addFavouriteItem;


// ----------------------------------------------------- Messages

const getMessages = (id, isVendor) => {
  //to retrieve messags from the database (currently set to return all data)
  const list = [id]
  let column;
  if (isVendor) {
    column = 'vendor_id';
  } else {
    column = 'user_id';
  }
  return pool
    .query(`
      SELECT messages.*, vendors.name as vendor_name, users.name as user_name
      FROM messages
      JOIN vendors ON vendor_id = vendors.id
      JOIN users ON user_id = users.id
      WHERE "${column}" = $1
      ORDER BY messages.id;
      `, list)
    .then((result) => {
      return result.rows;
    })
    .catch(err => console.error('query error', err.stack))

};
exports.getMessages = getMessages;


const addMessages = (list) => {
  return pool
    .query(`
      INSERT INTO messages
      (user_id, vendor_id, message, is_vendor)
      VALUES
      ($1, $2, $3, $4)
      `, list)
    .then((result) => {
      // console.log(result.rows);
      return result.rows;
    })
    .catch(err => console.error('query error', err.stack));
};
exports.addMessages = addMessages;
