
// data loaded

console.log(data[0]);

$(document).ready(function() {
  for (var movie of data) {
    $("tbody").append("<tr><td class='title'>" + movie.title + "</td>" +
                      "<td class='rating'>" + movie.rating + "%" + "</td>" +  //from movie.rating -> link to csfd
                      "<td class='release year'>" + movie.original_release_year + "</tr></td>");
    $(".title").append("<p class='description'>" + movie.short_description + "</p>");
  }

for (var i = 1900; i <= new Date().getFullYear(); i++) {
  $("select").append("<option>" + i + "</option>");
}

  $(".title").click (function () {
    $(this).toggleClass("bold");
    $(this).children(".description").slideToggle();
  });
});