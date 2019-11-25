var firebaseConfig = {
    apiKey: "AIzaSyD4KaKME8gCbkWly0-pBsLxBdlnzbenPhk",
    authDomain: "traintime-9bb56.firebaseapp.com",
    databaseURL: "https://traintime-9bb56.firebaseio.com",
    projectId: "traintime-9bb56",
    storageBucket: "traintime-9bb56.appspot.com",
    messagingSenderId: "608142647139",
    appId: "1:608142647139:web:5e59b41dbfe56f43dafd56"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

var database = firebase.database();

//Create variables to store train info
var name = "";
var destination = "";
var firstTime = "";
var frequency = 0;

//Create function to show current time on page (HH:mm:ss)
function currentTime() {
    //Use LT for hours and mins, use LTS for hours, mins, and secs
    var current = moment().format('LTS');
    $("#currentTime").html("Current Time: " + current);
    setTimeout(currentTime, 1000);
};

//On keyup, take user inputs and store them into variables
$(".form-field").on("keyup", function () {
    var train = $("#trainName").val().trim();
    var destination = $("#destination").val().trim();
    var firstTime = $("#trainStart").val().trim();
    var frequency = $("#frequency").val().trim();

    //Using sessionStorage, save data
    sessionStorage.setItem("name", train);
    sessionStorage.setItem("dest", destination);
    sessionStorage.setItem("time", firstTime);
    sessionStorage.setItem("freq", frequency);
});

//Using data saved with setItem, post info into corresponding IDs
$("#trainName").val(sessionStorage.getItem("name"));
$("#destination").val(sessionStorage.getItem("dest"));
$("#trainStart").val(sessionStorage.getItem("time"));
$("#frequency").val(sessionStorage.getItem("freq"));

//Submit button function
$("#submit").on("click", function (event) {
    event.preventDefault();

    trainName = $("#trainName").val().trim();
    destination = $("#destination").val().trim();
    startTime = $("#trainStart").val().trim();
    frequency = $("#frequency").val().trim();

    $(".form-field").val("");

    //Sending info up to database
    database.ref().push({
        trainName: trainName,
        destination: destination,
        frequency: frequency,
        startTime: startTime,
        dateAdded: firebase.database.ServerValue.TIMESTAMP
    });
    //Clear storage after info is used
    sessionStorage.clear();
});

//Pulled a lot of this from in-class activities
database.ref().on("child_added", function (childSnapshot) {
    //Do some calculations here to format everything correctly
    var startTimeConverted = moment(childSnapshot.val().startTime, "hh:mm").subtract(1, "years");
    var timeDiff = moment().diff(moment(startTimeConverted), "minutes");
    var timeRemain = timeDiff % childSnapshot.val().frequency;
    var arrivalTime = childSnapshot.val().frequency - timeRemain;
    var nextTrain = moment().add(arrivalTime, "minutes");

    //Create trainInfo var and make <tr>
    var trainInfo = $("<tr>");
    
    trainInfo.append($("<td>" + childSnapshot.val().trainName + "</td>"));
    trainInfo.append($("<td>" + childSnapshot.val().destination + "</td>"));
    trainInfo.append($("<td>" + childSnapshot.val().frequency + "</td>"));
    trainInfo.append($("<td>" + moment(nextTrain).format("LT") + "</td>"));
    trainInfo.append($("<td>" + arrivalTime + "</td>"));

    //Append info to proper ID after calcs are done and info is stored
    $("#trainFieldRows").append(trainInfo);

});


currentTime();

setInterval(function () {
    window.location.reload();
    //Reload after every minute, because one second reloads cause seizures
}, 60000);
