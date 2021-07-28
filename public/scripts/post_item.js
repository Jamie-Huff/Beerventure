// reveal add new item to vendor profile page

$(document).ready(function(event){

  $('.reveal-hide').click(function(event) {
    // event.preventDefault();
    const $postItemForm = $('.new-item-slide');
    if ($postItemForm.is(':visible')) {
      $postItemForm.slideUp();
    } else {
      $postItemForm.slideDown();
    }
  });

  
});



