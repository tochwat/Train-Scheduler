// Initialize Firebase using your config information
var config = {
  apiKey: "AIzaSyCjnh7Pyv97VRhbaSN4QY4vYiU-al2cXik",
  authDomain: "train-scheduler-d0cb5.firebaseapp.com",
  databaseURL: "https://train-scheduler-d0cb5.firebaseio.com",
  projectId: "train-scheduler-d0cb5",
  storageBucket: "train-scheduler-d0cb5.appspot.com",
  messagingSenderId: "19771983211"
};

firebase.initializeApp(config);

// Create a variable to reference the database.
var database = firebase.database();

//create a variable to reference child object in database "trainSchedules"
var connectedRef = database.ref("trainSchedules");


// When the client's connection state changes...
connectedRef.on('child_added', function (snap) {
  // If they are connected..  
  if (snap.val()) {
    //create new table rows with data
    var $tr = $('<tr>');
    //looping over each item in the database to append to table body
    [
      snap.val().name,
      snap.val().destination,
      snap.val().frequency, 
      snap.val().nextArrival, 
      snap.val().minutesAway,
    ].forEach(function (item){
      var $td = $('<td>');
      $tr.append(
        $td.text(item)
      );
    });
    
    $('tbody').append($tr);
  }
});

var submit = function(event) {
    // Prevent the page from refreshing
  event.preventDefault();
  // Get inputs
  var name = $("#name-input").val().trim();
  var destination = $("#destination-input").val().trim();
  var firstTrain = $("#first-train-input").val().trim();
  var frequency = $("#frequency-input").val().trim();


  console.log({
      name: name,
      destination: destination,
      frequency: frequency,
      firstTrain: firstTrain
    })

  // Change what is saved in firebase
  connectedRef.push({
    name: name,
    destination: destination,
    frequency: frequency,
    firstTrain: firstTrain
  });
  $(".input-fields").val("")
}

// capture Button Click
$('#submit').on('click', function (event) {
 submit(event);
});

// Hitting enter will cause submission too
  $('#submit').keyup(function (event) {
      if (event.keyCode === 13) {
        submit(event);
      }
  });

// Firebase watcher + initial loader HINT: .on("value")
connectedRef.on("child_added", function (snapshot) {

  // Log everything that's coming out of snapshot
  console.log(snapshot.val().name);
  console.log(snapshot.val().destination);
  console.log(snapshot.val().frequency);
  console.log(snapshot.val().firstTrain);

  // dynamically create new table rows

  // Change the HTML to reflect
  $("#name-display").text(snapshot.val().name);
  $("#destination-display").text(snapshot.val().destination);
  $("#frequency-display").text(snapshot.val().frequency);
  // $("#next-arrival-display").text(snapshot.val().nextArrival);
  // $("#minutes-away-display").text(snapshot.val().minutesAway);
  
  // Handle the errors
}, function (errorObject) {
  console.log("Errors handled: " + errorObject.code);
});

// database.ref().orderByChild("dateAdded")
//.limitToLast(1).on("child_added", function(snapshot) {
//   $(#"name-display").text(snapshot.val().name);
// })