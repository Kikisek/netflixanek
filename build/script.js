function render(data){
  $("tbody").empty();
  var rating;
  for (var movie of data) {
    if (movie.rating_csfd === null){
      rating = "no rating";
    } else {
      rating = movie.rating_csfd + "%";
    }
    $("tbody").append(`
      <tr class='openDescription'><td class='title' colspan='3'>${movie.title}</td></tr>             
      <tr class='details openDescription'><td class='rating'>${rating}</td>
      <td class='releaseYear'>${movie.year}</td>
      <td class='gen'>${movie.genres.join(", ")}</td></tr>
      <tr class='description'><td colspan='3'><p>${movie.description}</p></td></tr>
    `);
  };
  $(".openDescription").click (function (event) {
    $(this).nextAll(".description:first").children().children().slideToggle();
  });
};

function filterMovies (movies, year, country, genre, type, watched) {
  return movies.filter(function(film){
    var seen = true;
    if (film.my_rating_csfd === null) {
      seen = false;
    }
    var isWithinDecade = !year || (film.year > year && film.year < year + 10);
    var isFromCountry = !country || film.origins.includes(country);
    var isGenre = !genre || film.genres.includes(genre);
    var isType = !type || film.type.toLowerCase() === type.toLowerCase();
    var isWatched = seen === watched;
    return isWithinDecade && isFromCountry && isGenre && isType && isWatched;
  })
}

function extractCriteria(id){
  if ($("#" + id)[0].selectedIndex === 0){
    return null;
  }
  return $("#" + id).val();
}

$.getJSON("https://netflix-csfd.herokuapp.com/movies", function (data) {
  var movies = data.map(function(movie) {
    movie.genres = movie.genres ? movie.genres : [];
    movie.origins = movie.origins ? movie.origins : [];
    return movie;
  })
  $(document).ready(function() {
    //fill the filters with options
    for (var i = 1940; i <= (new Date().getFullYear()); i += 10){
      $("#year").append("<option>" + i + "s</option>");
    };
    for (var key in localization.countries){
      $("#country").append("<option>" + key + "</option>");
    };
    for(var key in localization.genres){
      $("#genre").append("<option>" + key + "</option>");
    };

    render(movies);

    $(".btn-success").click(function() {
      var yearStr = extractCriteria("year");
      var year = yearStr === null ? null : parseInt(yearStr);
      var country = extractCriteria("country");
      var genre = extractCriteria("genre");
      var type = extractCriteria("type");
      var watched = $("#watched").is(":checked");
      render(filterMovies(movies, year, country, genre, type, watched));
    });

    $(".btn-danger").click(function(){
      $("#year")[0].selectedIndex = 0;
      $("#country")[0].selectedIndex = 0;
      $("#genre")[0].selectedIndex = 0;
      $("#type")[0].selectedIndex = 0;
      $('#watched').prop('checked', false); 
    });

    $(".loader").addClass("hide");
  });
});