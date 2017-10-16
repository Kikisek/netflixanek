var page = 0;
var filtered = [];

// fill table with data
function render(data) {
  $("tbody").empty();
  var rating;
  for (var movie of data) {
    if (movie.rating_csfd === null) {
      rating = "no rating";
    } else {
      rating = movie.rating_csfd + "%";
    }
    $("tbody").append(`
      <tr class='open-description'><td class='title' colspan='3'>${movie.title}</td></tr>             
      <tr class='details open-description'>
        <td class='rating'>${rating}</td>
        <td class='releaseYear'>${movie.year}</td>
        <td class='genres'>${movie.genres.join(", ")}</td>
      </tr>
      <tr class='description closed'><td colspan='3'><div>${movie.description}</div></td></tr>
    `);
  };
  // $(".open-description").click (function () {
  //   $(this).nextAll(".description:first").children().children().slideToggle();
  // });
  $(".open-description").click(function () {
    $(this).nextAll(".description:first").toggleClass("closed");
  })
};

// filter data
function filterMovies(movies, year, country, genre, type, watched) {
  return movies.filter(function (film) {
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

// extract search criteria from search options
function extractCriteria(id) {
  if ($("#" + id)[0].selectedIndex === 0) {
    return null;
  }
  return $("#" + id).val();
}

// load data from server
$.getJSON("https://netflix-csfd.herokuapp.com/movies", function (data) {
  // if there is no genre or origin, return empty array
  var movies = data.map(function (movie) {
    movie.genres = movie.genres ? movie.genres : [];
    movie.origins = movie.origins ? movie.origins : [];
    return movie;
  })

  // load document
  $(document).ready(function () {
    //fill the filters with options
    for (var i = 1940; i <= (new Date().getFullYear()); i += 10) {
      $("#year").append("<option>" + i + "s</option>");
    };
    for (var key in localization.countries) {
      $("#country").append("<option>" + key + "</option>");
    };
    for (var key in localization.genres) {
      $("#genre").append("<option>" + key + "</option>");
    };

    // fill table with movies
    filtered = movies;
    render(movies.slice(0, 15));

    // handle pagination
    $("#next").click(function () {
      $("#previous").removeClass("hide");
      page++;
      render(filtered.slice(page * 15, (page + 1) * 15));
    });

    $("#previous").click(function () {
      page--;
      if (page === 0) {
        $("#previous").addClass("hide");
      }
      render(filtered.slice(page * 15, (page + 1) * 15));
    });
    
    // filter movies
    $(".btn-success").click(function () {
      var yearStr = extractCriteria("year");
      var year = yearStr === null ? null : parseInt(yearStr);
      var country = extractCriteria("country");
      var genre = extractCriteria("genre");
      var type = extractCriteria("type");
      var watched = $("#custom-checkbox").is(":checked");
      filtered = filterMovies(movies, year, country, genre, type, watched);
      page = 0;
      $("#previous").addClass("hide");
      render(filtered.slice(0, 15));
    });

    // reset search options
    $(".btn-danger").click(function () {
      $("#year")[0].selectedIndex = 0;
      $("#country")[0].selectedIndex = 0;
      $("#genre")[0].selectedIndex = 0;
      $("#type")[0].selectedIndex = 0;
      $('#custom-checkbox').prop('checked', false);
    });

    // hide loader when data is loaded
    $(".loader").addClass("hide");
    $("nav").removeClass("hide");
  });
});