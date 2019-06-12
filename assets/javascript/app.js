$(document).ready(function() {
    var firebaseConfig = {
        apiKey: "AIzaSyCZ3iQZ7oMEeD9BmGBE9eCZ1XPXLPZcYpw",
        authDomain: "click-app2.firebaseapp.com",
        databaseURL: "https://click-app2.firebaseio.com",
        projectId: "click-app2",
        storageBucket: "click-app2.appspot.com",
        messagingSenderId: "749062467253",
        appId: "1:749062467253:web:88f1cb4b1e91b49d"
      };
      // Initialize Firebase
      firebase.initializeApp(firebaseConfig);

      var database= firebase.database();


//when button is clicked information(from text boxes) entered by user is given a variable
$("#submit-button").on("click", function(){
    event.preventDefault();
    var trainName = $("#train-name").val().trim();
    var trainDestination = $("#destination").val().trim();
    var firstTrain = $("#first-train").val().trim();
    var trainFrequency = $("#frequency").val().trim();

    //frequency converted from string to number
    var convertedFrequency = parseInt(trainFrequency);
    
    //information stored into an object
    var newTrain = {

        name:trainName,
        destination:trainDestination,
        time: firstTrain,
        frequency: convertedFrequency,
        dateAdded: firebase.database.ServerValue.TIMESTAMP
    };

    //object pushed to firebase database
    database.ref().push(newTrain);

    alert("You added a new train");
    
    //clear textboxes
    $("#train-name").val("");
    $("#destination").val("");
    $("#first-train").val("");
    $("#frequency").val("");
})

    //when a new "child" is added in firebase, run this function
database.ref().on("child_added", function(snap){
    console.log(snap.val())

    //variables given to names from database
    var name = snap.val().name;
    var destination = snap.val().destination;
    var firstTime = snap.val().time;
    var frequency = snap.val().frequency;


    //first train time is set to unix and this time one year ago (so that it's in the past)
     var firstTimeConverted = moment(firstTime, "hh:mm A").subtract(1, "years").format("X");
  

    //difference between the present time and first Train time (by minutes)
     var difference = moment().diff(moment.unix(firstTimeConverted), "minutes");

     //remainder is calculated by the modulus
     //we are dividing the difference between the first time and the present time 
     //by the interval of minutes the train arrives
     //the division calculates how many times the train has arrived in that time period
     //the remainder will tell the number of minutes extra since the last arrival
     var remainder = difference % frequency;

    //minutes away calculated by the interval of minutes the train arrives by the minutes since last arrival
     var minutesAway = frequency - remainder;


    //here is an example of what is going on:
    //Imagine the train is 20 minutes away
    //the train arrives every 3 minutes
    //20 / 3 = 6.67 or 6 2/3
    //this means the train has come 6 times and is 2/3 of the way from last arrival 
    //You can also look at the remainder as the last train being 2minutes (out of the 3 minutes) of the journey
    //If you subtract how often the train comes and the remainder you will get one 
    //3-2 =1 so the train is 1 minute away



     //the time of the next arrival is the current time plus how many minutes away the train is
     var nextArrival = moment().add(minutesAway, "minutes").format("hh:mm A");




//adding the information to the table row, and appending table data 
    var trainAdded = $("<tr>").append(
        $("<td>").text(name),
        $("<td>").text(destination),
        $("<td>").text(frequency),
        $("<td>").text(nextArrival),
        $("<td>").text(minutesAway)
    )

    //adding the information above to the table on the page
    $("#train-table > tbody").append(trainAdded);
})





});


