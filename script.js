// Initialize Firebase
var config = {
  apiKey: "AIzaSyCjnh7Pyv97VRhbaSN4QY4vYiU-al2cXik",
  authDomain: "train-scheduler-d0cb5.firebaseapp.com",
  databaseURL: "https://train-scheduler-d0cb5.firebaseio.com",
  projectId: "train-scheduler-d0cb5",
  storageBucket: "train-scheduler-d0cb5.appspot.com",
  messagingSenderId: "19771983211"
};

firebase.initializeApp(config);

// variable to reference the database
var database = firebase.database();

// variable to reference child object in database "trainSchedules"
var connectedRef = database.ref("trainSchedules");


// Event handler for when client's connection state changes
connectedRef.on('child_added', function (snap) {
  // If they are connected.. 
  if (snap.val()) {
    //create new table row with data
    var $tr = $('<tr>');
    //loop over each item in the database to append to the table body
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
  // Get user inputs
  var name = $("#name-input").val().trim();
  var destination = $("#destination-input").val().trim();
  var firstTrain = $("#first-train-input").val().trim();
  var frequency = $("#frequency-input").val().trim();

  //----------------------------------------Adding Moment.JS code to submit function----------------------------//

  //first time (1 year prior so it comes before the current time)
  var firstTrainConverted = moment(firstTrain, "HH:mm").subtract(1, "years");
  console.log(firstTrainConverted);

  // current Time
  var currentTime = moment();
  console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

  // difference between the times
  var diffTime = moment().diff(moment(firstTrainConverted), "minutes");
  console.log("DIFFERENCE IN TIME: " + diffTime);

  // time apart (remainder)
  var tRemainder = diffTime % frequency;
  console.log(tRemainder);

  // minute until train
  var minutesAway = frequency - tRemainder;
  console.log("MINUTES TILL TRAIN: " + minutesAway);

  // next train
  var nextTrain = moment().add(minutesAway, "minutes");
  console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm"));
  var nextArrival = moment(nextTrain).format("hh:mm");


  //----------------------------------------End Moment.js code --------------------------------------------------//


  console.log({
      name: name,
      destination: destination,
      frequency: frequency,
      firstTrain: firstTrain,
      nextArrival: nextArrival,
      minutesAway: minutesAway
    })

  // adding data to firebase
  connectedRef.push({
    name: name,
    destination: destination,
    frequency: frequency,
    firstTrain: firstTrain,
    nextArrival: nextArrival,
    minutesAway: minutesAway
  });
  $(".input-fields").val("")
}

// submit button click event listener
$('#submit').on('click', function (event) {
 submit(event);
});

// event listener for hitting enter key
  $('#submit').keyup(function (event) {
      if (event.keyCode === 13) {
        submit(event);
      }
  });

// firebase watcher and initial loader 
connectedRef.on("child_added", function (snapshot) {

  // logging everything that's coming out of snapshot
  console.log(snapshot.val().name);
  console.log(snapshot.val().destination);
  console.log(snapshot.val().frequency);
  console.log(snapshot.val().firstTrain);
  console.log(snapshot.val().nextArrival);
  console.log(snapshot.val().minutesAway);

  // dynamically create new table rows

  // change the HTML to reflect
  $("#name-display").text(snapshot.val().name);
  $("#destination-display").text(snapshot.val().destination);
  $("#frequency-display").text(snapshot.val().frequency);
  $("#next-arrival-display").text(snapshot.val().nextArrival);
  $("#minutes-away-display").text(snapshot.val().minutesAway);

  // handle errors
}, function (errorObject) {
  console.log("Errors handled: " + errorObject.code);
});

// database.ref().orderByChild("dateAdded")
//.limitToLast(1).on("child_added", function(snapshot) {
//   $(#"name-display").text(snapshot.val().name);
// })