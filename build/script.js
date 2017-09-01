
// data loaded

$(document).ready(function() {
  $.getJSON("https://netflix-csfd.herokuapp.com/movies", function(data){

    for (var movie of data) {
      $("tbody").append(`
        <tr><td class='title col-md-8'>${movie.title}</td>             
        <td class='rating col-md-1'>${movie.rating + "%"}</td>            //link to csfd
        <td class='releaseYear col-md-1'>${movie.original_release_year}</td>
        <td class='gen col-md-1'><i class='${genres[Math.floor(Math.random()*genres.length)]}' aria-hidden='true'></i></td></tr>
        <tr class='description'><td colspan='4'>${movie.short_description}</td></tr>
      `);
    };

    $(".title").click (function (event) {
      $(this).parent().next(".description").slideToggle();
    });

    $(".loader").addClass("hide");
  });
});
