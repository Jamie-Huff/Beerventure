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
    .query(`SELECT items.*, vendors.name as vendor_name
    FROM items
    JOIN vendors ON vendors.id = vendor_id
    WHERE featured=TRUE`)
    .then(res => res.rows ? res.rows : null)
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

// router.get("/", (req, res) => {
//   let query = `SELECT * FROM items_for_sale WHERE featured=TRUE`;
//   db.query(query)
//     .then(data => {
//       const products = data.rows;
//       // console.log(products)
//       res.render("urls_index", {products})
//     })
//     .catch(err => {
//       res
//         .status(500)
//         .json({ error: err.message });
//     });
// });
const getMessages = () => {
  //to retrieve messags from the database (currently set to return all data)
  return pool
    .query(`
      SELECT messages.*, vendors.name as name
      FROM messages
      JOIN vendors ON vendor_id = vendors.id
      ORDER BY vendor_id;
      `)
    .then((result) => {
      console.log(result.rows);
      result.rows;
    })
    .catch(err => console.error('query error', err.stack));

};
exports.getMessages = getMessages;
