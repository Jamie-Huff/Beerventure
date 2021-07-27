const { Pool } = require('pg');
const dbParams = require('../lib/db.js');

const pool = new Pool(dbParams);


pool.connect().then(() => {
  console.log("Connected");
}).catch(e => {
  console.log(e.message);
});


/// ----------------------------------------------------- Users

const getUserByEmail = function(email) {
  return pool
    .query(`SELECT * FROM users WHERE email = $1;`, [email])
    .then(res => res.rows[0] ? res.rows[0] : null)
    .catch(err => console.error('query error', err.stack));
};
exports.getUserByEmail = getUserByEmail;


/// ----------------------------------------------------- Vendors

// We could really combine this with getUserByEmail and just JOIN tables, search both for a match
const getVendorByEmail = function(email) {
  return pool
    .query(`SELECT * FROM vendors WHERE email = $1;`, [email])
    .then(res => res.rows[0] ? res.rows[0] : null)
    .catch(err => console.error('query error', err.stack));
};
exports.getVendorByEmail = getVendorByEmail;


/// ----------------------------------------------------- Products

const getFeaturedProducts = function() {
  // Make this modular so 3 different sets of products are returned for different user types?

  return pool
    .query(`SELECT * FROM items WHERE featured=TRUE`)
    .then(res => res.rows[0] ? res.rows[0] : null)
    .catch(err => console.error('query error', err.stack));
}
exports.getFeaturedProducts = getFeaturedProducts;



// Products from only one vendor
const getVendorsProducts = function(email) {

  return pool
    .query(`SELECT * FROM items JOIN vendors ON vendor_id = vendors.id WHERE vendors.email=$1`, [email])
    .then(res => res.rows[0] ? res.rows[0] : null)
    .catch(err => console.error('query error', err.stack));
}
exports.getVendorsProducts = getVendorsProducts;

