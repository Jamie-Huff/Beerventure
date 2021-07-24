-- DROP TABLE IF EXISTS items_for_sale CASCADE;

-- ITEMS FOR SALE
CREATE TABLE items_for_sale (
  id SERIAL PRIMARY KEY NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price INTEGER NOT NULL,
  posted_by INTEGER REFERENCES vendors(id) ON DELETE CASCADE,
  sold BOOLEAN DEFAULT FALSE,
  date_posted TIMESTAMP DEFAULT date()::now,
  featured BOOLEAN DEFAULT FALSE,
  category VARCHAR(255) NOT NULL,
  abv INTEGER NOT NULL,
  mliter INTEGER NOT NULL
);
