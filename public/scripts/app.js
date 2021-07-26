$(() => {
  // $.ajax({
  //   method: "GET",
  //   url: "/api/users"
  // }).done((users) => {
  //   for(user of users) {
  //     $("<div>").text(user.name).appendTo($("body"));
  //   }
  // });;
    $("#search-city").submit((event) => {
      event.preventDefault()
        $.ajax({
    method: "POST",
    url: "/search",
    body: $(this).serialize()
  }).then((vendors) => {
    console.log(vendors)
  }).catch((error) => {
    console.log(error)
  })
    })
});

