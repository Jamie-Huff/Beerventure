DROP TABLE IF EXISTS favourites CASCADE;

-- FAVOURITES
CREATE TABLE favourites (
  id SERIAL PRIMARY KEY NOT NULL,
  item_id INTEGER REFERENCES items_for_sale(id) ON DELETE CASCADE,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  vendor_id INTEGER REFERENCES vendors(id) ON DELETE CASCADE
);
