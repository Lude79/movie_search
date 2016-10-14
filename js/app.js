(function(){

"use strict";

var OMBdUrl = "http://www.omdbapi.com";
var moviePoster;

//Search function (incl. wiping data to reset when letters/numbers are deleted)
$(document).on("keyup","form", function(){
    var Movies = "";
    $("#movies").empty();
    var title = $("#search").val();
    var year = $("#year").val();

    //Object for Ajax search
    var options = {
        s: title,
        y: year,
        plot: "short",
        r: "json",
        jsoncallback: "?"
        };

    //Generate elements with search results to push to DOM
    function displayMovies(data){
        if(typeof data.Search === "undefined"){
            Movies += "<li class='no-movies'>";
            Movies +=  "<i class='material-icons icon-help'>help_outline</i>No movies found that match: " + title;
            Movies +=  "</li>";
            } else {
                $.each(data.Search, function(i,Results){
                    Movies += '<li>' + '<div class="poster-wrap">';

                    if(Results.Poster=="N/A"){
                        Movies += '<i class="material-icons poster-placeholder" id=' +Results.imdbID+ '>crop_original</i>';
                    } else {
                        Movies += '<img style="cursor:pointer" class="movie-poster"' + ' id='+ Results.imdbID + ' src="' + "http://img.omdbapi.com/?i=" + Results.imdbID + "&apikey=7c37867a" + '">';
                        }

                    Movies += '</div>';
                    Movies += '<span class="movie-title">' + Results.Title + '</span>';
                    Movies += '<span class="movie-year">' + Results.Year + '</span>';
                    Movies += '</li>';
                });
            }

        //Populate page with search results
        $("#movies").append(Movies);
    }

  //Ajax call for search page
  $.getJSON(OMBdUrl,options, displayMovies);
});

//Show indiviual page with movie information
$("ul").on("click",".movie-poster,.poster-placeholder",function(){
    //clear page
    $("ul").hide();

    //identify movie that is being selected
    var imbdIdentifier = $(this).attr("id");

    //Object for Ajax call
    var MoviePage = "";
    var optionsSingle = {
    i: imbdIdentifier,
    plot: "long",
    r: "json",
    jsoncallback: "?"
    };

    //Generate content for single movie page
    function displayMoviePage(info){
        var movieTitle = info.Title;
        var movieYear = info.Year;
        var imdbRating = info.imdbRating;
        var plot = info.Plot;
        moviePoster = info.imdbID;
        MoviePage += '<div class="imageDiv1">';

        if (info.Poster=="N/A"){
            //MoviePage += '<i class="material-icons poster-placeholder">crop_original</i>';
        } else {
            MoviePage += '<div class="imageDiv2"><img src="http://img.omdbapi.com/?i=' + moviePoster + '&apikey=7c37867a"></div>';
        }

        MoviePage += '<p id="return">< Search results</p>';
        MoviePage += '<p id="movieInfo">' + movieTitle + ' (' + movieYear + ')</p>';
        MoviePage += '<p id="rotten"> IMBD Rating: ' + imdbRating + '</p>';
        MoviePage += '<div id="synopsis">';
        MoviePage += '<p id="title">Plot Synopsis<p>';
        MoviePage += '<p id="plot">' + plot + '<p>';
        MoviePage += '<button id="goIMDB">View on IMBD</button>';
        MoviePage += '</div>';
        MoviePage += '</div>';

        //Populate single movie page
        $(".main-content").append(MoviePage);

        //Go to IMBD page if clicked
        $(".main-content").on("click","#goIMDB",function(){
            window.location.href = "http://www.imdb.com/title/" + imbdIdentifier;
        });

        //Callback event to go back to main page
        $(".main-content").on("click","#return",function(){
            $(".imageDiv1").remove();
            $("ul").show();
        });

    }

  //Ajax call for single page
  $.getJSON(OMBdUrl,optionsSingle, displayMoviePage);

});

}());