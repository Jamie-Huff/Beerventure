// reveal add new item to vendor profile page

$(document).ready(function(){

  $("#hide").click(function(){
    $("new-item-slide").slideUp();
  });

  $("#reveal").click(function(){
    $("new-item-slide").slideDown();
  });

});
