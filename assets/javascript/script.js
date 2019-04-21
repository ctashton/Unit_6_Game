//create topics list
var topics = ["BULBASAUR", "IVYSAUR", "VENUSAUR", "CHARMANDER", "CHARMELEON", "CHARIZARD", "SQUIRTLE", "WARTORTLE", "BLASTOISE", "CATERPIE"]


// function called to generate the buttons
function topicsWrite(){
  //empty buttons div
  $("#buttons").empty();
  //for the length of our topics
  for (let i = 0; i < topics.length; i++) {
    //create a button and assign it a variable topic button
    var topicButtons = $("<button>");
    //give it these attributes
    $(topicButtons).attr("id", "savedSearchTerm").attr("data-person", topics[i]).addClass("btn btn-primary");
    //change text to uppercase
    $(topicButtons).text(topics[i].toUpperCase()) 
    //append buttons div with new topic buttons
    $("#buttons").append(topicButtons);
  };

};

// function that manages like functionality using iconify's heart icon
$(document).on("click",".iconify", function (){
 // creating a liked variable out of our data-liked value (initially set to false)
  var liked = $(this).attr("data-liked");
  // if liked is false
  if (liked === "false"){ 
    // change to true
      $(this).attr("data-liked", "true")
      // color heart red
      $(this).css("color", "red")
      //create new div (to break elements to be added)
      newDiv = $("<div>")
      //append the parent element to this div (our whole gif box)
      newDiv.append($(this).parent());
      //append the favorite gifs ID with our newDiv
      $("#favorite-gifs").append(newDiv)
    } else {
      // change color back to original state
      $(this).css("color", "")
      // change data back to false
      $(this).attr("data-liked", "false")
      // prepend gif back to original div
      $("#gifs-appear-here").prepend($(this).parent());
    }
  
  });

// function to create new search terms as buttons
$("#submitButton").on("click", function (event)
{
  //dont refresh the page
  event.preventDefault();
  // take the search term value and create a variable called searchTerm out of it
  var searchTerm = $("#searchMe").val().trim()
  // check if the topics array includes our search term (only uppercased to be used to prevent multiple additions)
  if (topics.includes(searchTerm.toUpperCase())){
    // if it's found in array, reset form, end function
    $("#searchForm").trigger("reset")
    return;
    // else push search term to array, write buttons using topicsWrite() function, reset form
  } else{
  topics.push(searchTerm);
  topicsWrite();
  $("#searchForm").trigger("reset")
  }
});

// function for our buttons to begin the ajax query method and grab out gif data
$(document).on("click", '#savedSearchTerm', function() {
  // taking the data-person attribute, and assigning it to a variable person
  var person = $(this).attr("data-person");
  // this is creating a variable for our queryURL concatinating it with our assigned person
  var queryURL = "https://api.giphy.com/v1/gifs/search?q=" +
    person + "&api_key=vEmez2NvwBu7VeOnNtxL24iZukfkYIS5&limit=10";
  // hey jquery, do the following ajax call method
  $.ajax({
    // our url is our variable assigned
    url: queryURL,
    // method to use is the GET method
    method: "GET"
  })// after grabbing our info through the API send the response through this function
    .then(function(response) {
      // create a variable called response to hold the data grabbed
      var results = response.data;
     // var animate = response.data.images.fixed_height.url
  
      //for loop that goes through the length of our API response data that was assigned to results
      for (var i = 0; i < results.length; i++) {
        //every loop create a div element and assigns it a variable as gifDiv
        var gifDiv = $("<div>");
        gifDiv.attr("id", "gifImage")
        // this variable holds the current indeces rating
        var rating = results[i].rating; 
        // this variable holds a jquery paragraph creation that holds the text of "rating: " + our rating previously assigned
        var p = $("<p>").text("Rating: " + rating);
        var like = $("<span>")
        like.addClass("iconify")
        like.attr("data-icon", "dashicons:heart").attr("data-inline","false").attr("data-liked","false");
        // creating a variable for the person image that creats an image tag 
        var personImage = $("<img>");
        // assigns a source attribute to our image tag based off of the current results index and its object data images.fixed_height.url
        personImage.attr("src", results[i].images.fixed_height.url);
        personImage.attr("data-state", "animate");
        personImage.attr("data-still", results[i].images.fixed_height_still.url);
        personImage.attr("data-animate", results[i].images.fixed_height.url);
        personImage.addClass("col-12 giphyGif")

        gifDiv.prepend(like);
        // prepend our created gifDiv with our created p variable
        gifDiv.prepend(p);
        // prepend our created personImage to our gifDiv as well
        gifDiv.prepend(personImage);

        $("#gifs-appear-here").prepend(gifDiv);
      }
    })
    
    .then(function(){
        $(".giphyGif").on("click", function() {
          var state = $(this).attr("data-state");

        
          if (state === "still"){ 
              $(this).attr("src", $(this).attr("data-animate"))
              $(this).attr("data-state", "animate")
            } else {
              $(this).attr("src", $(this).attr("data-still"))
              $(this).attr("data-state", "still")
            }
      
  
    });
  
});

});