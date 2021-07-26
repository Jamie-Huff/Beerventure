const { Pool, Client } = require('pg');

const pool = new Pool({
  user: 'vagrant',
  password: '123',
  host: 'localhost',
  database: 'lightbnb'
});


const bcrypt = require('bcrypt');
const saltRounds = 10;


/// ----------------------------------------------------- Users

const getUserByEmail = function(email) {
  return pool
    .query(`SELECT * FROM users WHERE email = $1;`, [email])
    .then(res => res.rows[0] ? res.rows[0] : null)
    .catch(err => console.error('query error', err.stack));
};
exports.getUserByEmail = getUserByEmail;

// const authenticateUser =






/// ----------------------------------------------------- Products

const getFeaturedProducts = function() {
  // Make this modular so 3 different sets of products are returned for different user types?

  return pool
    .query(`SELECT * FROM items_for_sale WHERE featured=TRUE`)
    .then(res => res.rows[0] ? res.rows[0] : null)
    .catch(err => console.error('query error', err.stack));
}
exports.getFeaturedProducts = getFeaturedProducts;





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
