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
      snap.val().role,
      snap.val().startDate, 
      snap.val().monthsWorked, 
      snap.val().monthlyRate,
      snap.val().totalBilled
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
  var role = $("#role-input").val().trim();
  var startDate = $("#start-date-input").val().trim();
  var monthlyRate = $("#monthly-rate-input").val().trim();
  //var monthsWorked = $("#months-worked-input").val()trim();
  //var totalBilled = $("#total-billed-input").val()trim();

  console.log({
      name: name,
      role: role,
      startDate: startDate,
      monthlyRate: monthlyRate
      //monthsWorked: monthsWorked,
      //totalBilled: totalBilled
    })

  // Change what is saved in firebase
  connectedRef.push({
    name: name,
    role: role,
    startDate: startDate,
    monthlyRate: monthlyRate
    //monthsWorked: monthsWorked,
    //totalBilled: totalBilled
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
  console.log(snapshot.val().role);
  console.log(snapshot.val().startDate);
  console.log(snapshot.val().monthlyRate);
  //console.log(snapshot.val().monthlyWorked);
  //console.log(snapshot.val().totalBilled);

  // dynamically create new table rows

  // Change the HTML to reflect
  $("#name-display").text(snapshot.val().name);
  $("#role-display").text(snapshot.val().role);
  $("#start-Date-display").text(snapshot.val().startDate);
  $("#monthly-Rate-display").text(snapshot.val().monthlyRate);
  //$("#months-Worked-display").text(snapshot.val().monthsWorked);
  //$("#total-Billed-display").text(snapshot.val().totalBilled;
  // Handle the errors
}, function (errorObject) {
  console.log("Errors handled: " + errorObject.code);
});

// database.ref().orderByChild("dateAdded")
//.limitToLast(1).on("child_added", function(snapshot) {
//   $(#"name-display").text(snapshot.val().name);
// })