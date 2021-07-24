-- ITEMS DATA
INSERT INTO items_for_sale
  (posted_by, name, description, price, featured, category, abv, mliter)
VALUES
  (1, 'Lavish Lager', 'description', 700, TRUE, 'lager', 500, 355),
  (2, 'Languish Lager', 'description', 700, TRUE, 'lager', 487, 473),
  (2, 'Ill IPA', 'description', 700, TRUE, 'ipa', 550, 355),
  (3, 'Apple Ale', 'description', 600, TRUE, 'ale', 497, 750),
  (3, 'Polar Porter', 'description', 600, TRUE, 'porter', 510, 330),
  (4, 'Ice IPA', 'description', 900, TRUE, 'ipa', 500, 330),
  (5, 'Stressed Stout', 'description', 1000, TRUE, 'stout', 500, 355),
  (6, 'Saturday Stout', 'description', 800, TRUE, 'stout', 425, 500),
  (6, 'Island IPA', 'description', 800, TRUE, 'ipa', 425, 473),
  (7, 'Lanky Lager', 'description', 700, TRUE, 'lager', 750, 355),
  (7, 'Cranky Cider', 'description',700, FALSE, 'cider', 500, 355),
  (8, 'Air Ale', 'description', 600, FALSE, 'ale', 724, 473),
  (8, 'Insolent IPA', 'description', 600, FALSE, 'ipa', 425, 473),
  (9, 'Ample ALe', 'description', 1000, FALSE, 'ale', 526, 750),
  (9, 'Serious Stout', 'description', 1000, FALSE, 'stout', 820, 355),
  (10, 'Stuffy Stout', 'description', 1100, FALSE, 'stout', 413, 750);
