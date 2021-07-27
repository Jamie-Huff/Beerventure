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


const addNewUser = function(user) {
  const values = [user.name, user.email, user.password, user.phone];
  return pool
    .query(`
    INSERT INTO users (name, email, password, phone_number)
    VALUES($1, $2, $3, $4)
    RETURNING *;
    `, values)
    .then(res => res.rows)
    .catch(err => console.error('query error', err.stack));
};
exports.addNewUser = addNewUser;



// Combined helper function to check if email exists in users or vendors
const userExists = async function(email) {
  try{
    const isUser = await getUserByEmail(email);
    const isVendor = await getVendorByEmail(email);
    return {isUser, isVendor}
  } catch(err) {
    console.log(err.message);
  }
}
exports.userExists = userExists;


/// ----------------------------------------------------- Vendors

// We could combine this with getUserByEmail and just JOIN tables, search both for a match?
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



/// ----------------------------------------------------- Messages


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
