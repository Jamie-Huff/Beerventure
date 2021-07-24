-- DROP TABLE IF EXISTS vendors CASCADE;

-- VENDORS
CREATE TABLE vendors (
  id SERIAL PRIMARY KEY NOT NULL,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(225) NOT NULL,
  password VARCHAR(225) NOT NULL,
  city VARCHAR(225) NOT NULL,
  postal_code VARCHAR(225) NOT NULL,
  phone_number VARCHAR(20),
  website_url VARCHAR(255),
  vendor_description TEXT
);
