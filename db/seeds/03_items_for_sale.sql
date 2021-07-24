-- ITEMS DATA
INSERT INTO items_for_sale
  (posted_by, name, description, price, featured, category, abv, mliter)
VALUES
  (1, "Lavish Lager", 700, TRUE, "lager", 500, 355),
  (2, "Languish Lager", 700, TRUE, "lager", 487, 473),
  (2, "Ill IPA", 700, TRUE, "ipa", 550, 355),
  (3, "Apple Ale", 600, TRUE, "ale", 497, 750),
  (3, "Polar Porter", 600, TRUE, "porter", 510, 330),
  (4, "Ice IPA", 900, TRUE, "ipa", 500, 330),
  (5, "Stressed Stout", 1000, TRUE, "stout", 500, 355),
  (6, "Saturday Stout", 800, TRUE, "stout", 425, 500),
  (6, "Island IPA", 800, TRUE, "ipa", 425, 473),
  (7, "Lanky Lager", 700, TRUE, "lager", 750, 355),
  (7, "Cranky Cider", 700, FALSE, "cider", 500, 355),
  (8, "Air Ale", 600, FALSE, "ale", 724, 473),
  (8, "Insolent IPA", 600, FALSE, "ipa", 425, 473),
  (9, "Ample ALe", 1000, FALSE, "ale", 526, 750),
  (9, "Serious Stout", 1000, FALSE, "stout", 820, 355),
  (10, "Stuffy Stout", 1100, FALSE, "stout", 413, 750);
