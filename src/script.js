let page = 0;
let filtered = [];

function showFirstPage(movies) {
  page = 0;
  $("#movie-count").text(movies.length + " movies");
  $("#page-number").text(page + 1 + " / " + Math.floor(movies.length/15 + 1));
  $("#previous").addClass("hide");
  $("#next").removeClass("hide");
  if (page + 1 >= movies.length / 15) {
    $("#next").addClass("hide");
  }
  render(movies.slice(0, 15));  
}

// fill table with data
function render(data) {
  $("tbody").empty();
  for (let movie of data) {
    const rating = movie.rating_csfd ? movie.rating_csfd + "%" : "no rating";
    $("tbody").append(`
      <tr class='open-description'><td class='title' colspan='3'>${movie.title}</td></tr>             
      <tr class='details open-description'>
        <td class='rating'>${rating}</td>
        <td class='releaseYear'>${movie.year}</td>
        <td class='genres'>${movie.genres.join(", ")}</td>
      </tr>
      <tr class='description closed'><td colspan='3'><div>${movie.description}</div></td></tr>
    `);
  }
  $(".open-description").click(() => {
    $(this).nextAll(".description:first").toggleClass("closed");
  })
}

// filter data
function filterMovies(movies, year, country, genre, type, watched) {
  return movies.filter(film => {
    const notSeen = !film.my_rating_csfd;
    const isWithinDecade = !year || (film.year > year && film.year < year + 10);
    const isFromCountry = !country || film.origins.includes(country);
    const matchesGenre = !genre || film.genres.includes(genre);
    const matchesType = !type || film.type.toLowerCase() === type.toLowerCase();
    const isWatched = watched || notSeen;
    return isWithinDecade && isFromCountry && matchesGenre && matchesType && isWatched;
  })
}

// extract search criteria from search options
function extractCriteria(id) {
  if ($("#" + id)[0].selectedIndex === 0) {
    return null;
  }
  return $("#" + id).val();
}

function displayFilteredMovies(movies) {
  const yearStr = extractCriteria("year");
  const year = yearStr === null ? null : parseInt(yearStr);
  const country = extractCriteria("country");
  const genre = extractCriteria("genre");
  const type = extractCriteria("type");
  const watched = $("#custom-checkbox").is(":checked");
  filtered = filterMovies(movies, year, country, genre, type, watched);
  return showFirstPage(filtered);
}

// load data from server
$.getJSON("https://netflix-csfd.herokuapp.com/movies", data => {
  // if there is no genre or origin, return empty array
  const movies = data.map(movie => {
    movie.genres = movie.genres ? movie.genres : [];
    movie.origins = movie.origins ? movie.origins : [];
    return movie;
  })

  // load document
  $(document).ready(() => {
    //fill the filters with options
    for (let i = 1940; i <= (new Date().getFullYear()); i += 10) {
      $("#year").append("<option>" + i + "s</option>");
    }
    for (let key in localization.countries) {
      $("#country").append("<option>" + key + "</option>");
    }
    for (let key in localization.genres) {
      $("#genre").append("<option>" + key + "</option>");
    }

    // fill table with movies
    filtered = movies;
    showFirstPage(movies);

    // handle pagination
    $("#next").click(() => {
      page++;
      $("#page-number").text(page + 1 + " / " + Math.floor(filtered.length/15 + 1));      
      $("#previous").removeClass("hide");
      if (page + 1 >= filtered.length / 15) {
        $("#next").addClass("hide");
      }
      render(filtered.slice(page * 15, (page + 1) * 15));
    });

    $("#previous").click(() => {
      page--;
      $("#page-number").text(page + 1 + " / " + Math.floor(filtered.length/15 + 1));
      $("#next").removeClass("hide");
      if (page === 0) {
        $("#previous").addClass("hide");
      }
      render(filtered.slice(page * 15, (page + 1) * 15));
    });

    // reset search options
    $(".btn-danger").click(() => {
      $("#year")[0].selectedIndex = 0;
      $("#country")[0].selectedIndex = 0;
      $("#genre")[0].selectedIndex = 0;
      $("#type")[0].selectedIndex = 0;
      $("#custom-checkbox").prop("checked", true);
      filtered = movies;
      showFirstPage(movies);
    });

    // filter movies without pressing Search button
    $(".selection-criteria").on("change", ".criteria", () => {
      displayFilteredMovies(movies);
    });

    // hide loader when data is loaded
    $(".loader").addClass("hide");
    $("nav").removeClass("hide");
  });
});