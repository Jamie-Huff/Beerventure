-- ITEMS DATA
INSERT INTO items
  (vendor_id, image, name, description, price, featured, category, abv, mliter)
VALUES
  (1, 'https://imagesvc.meredithcorp.io/v3/mm/image?url=https%3A%2F%2Fstatic.onecms.io%2Fwp-content%2Fuploads%2Fsites%2F44%2F2020%2F09%2F29%2Flight-beer.jpg&q=85','Lavish Lager', 'description', 700, TRUE, 'lager', 500, 355),
  (2, 'https://images.unsplash.com/photo-1600960144142-82fae1c3a471?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=967&q=80','Languish Lager', 'description', 700, TRUE, 'lager', 487, 473),
  (2, 'https://images.unsplash.com/photo-1598276804630-ce622f446cb2?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=634&q=80','Ill IPA', 'description', 700, TRUE, 'ipa', 550, 355),
  (3, 'https://images.unsplash.com/photo-1558642891-54be180ea339?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=634&q=80','Apple Ale', 'description', 600, TRUE, 'ale', 497, 750),
  (3, 'https://images.unsplash.com/photo-1582762843356-c58f2a78dc7c?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=634&q=80','Polar Porter', 'description', 600, TRUE, 'porter', 510, 330),
  (4, 'https://images.unsplash.com/photo-1592279902711-d8b2a9358515?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=675&q=80','Ice IPA', 'description', 900, TRUE, 'ipa', 500, 330),
  (5, 'https://images.unsplash.com/photo-1618183479302-1e0aa382c36b?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=634&q=80','Stressed Stout', 'description', 1000, TRUE, 'stout', 500, 355),
  (6, 'https://images.unsplash.com/photo-1502639061938-88fbc74854b4?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80','Saturday Stout', 'description', 800, TRUE, 'stout', 425, 500),
  (6, 'https://images.unsplash.com/photo-1504502350688-00f5d59bbdeb?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1050&q=80','Island IPA', 'description', 800, TRUE, 'ipa', 425, 473),
  (7, 'https://images.unsplash.com/photo-1523567830207-96731740fa71?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=634&q=80','Lanky Lager', 'description', 700, TRUE, 'lager', 750, 355),
  (7, 'https://images.unsplash.com/photo-1535324762078-9c5529d8d32d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1yZWxhdGVkfDd8fHxlbnwwfHx8fA%3D%3D&auto=format&fit=crop&w=500&q=60','Cranky Cider', 'description',700, FALSE, 'cider', 500, 355),
  (8, 'https://images.unsplash.com/photo-1586001530945-06ebc1da5cb7?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=634&q=80','Air Ale', 'description', 600, FALSE, 'ale', 724, 473),
  (8, 'https://images.unsplash.com/photo-1586993451228-09818021e309?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=634&q=80','Insolent IPA', 'description', 600, FALSE, 'ipa', 425, 473),
  (9, 'https://images.unsplash.com/photo-1558645836-e44122a743ee?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=634&q=80','Ample ALe', 'description', 1000, FALSE, 'ale', 526, 750),
  (9, 'https://images.unsplash.com/photo-1597248287487-aeb443f64ddf?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=634&q=80','Serious Stout', 'description', 1000, FALSE, 'stout', 820, 355),
  (10, 'https://images.unsplash.com/photo-1613478223984-2926776f434a?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1yZWxhdGVkfDF8fHxlbnwwfHx8fA%3D%3D&auto=format&fit=crop&w=500&q=60','Stuffy Stout', 'description', 1100, FALSE, 'stout', 413, 750);
