// Firebase Config
var config = {
    
    apiKey: "AIzaSyCPNCvz-In9-7bF0Qhnu6Btf1qovMO0FhI",
    authDomain: "trainscheduler-81113.firebaseapp.com",
    databaseURL: "https://trainscheduler-81113.firebaseio.com",
    storageBucket: "trainscheduler-81113.appspot.com",
    messagingSenderId: "996628885535"
  
  };

  // Initialize firebase config
  firebase.initializeApp(config);

  // Get a reference to the database service
  var database = firebase.database();

  // onclick event - on Submit add train information to the firebase database
  $("#add-submit").on("click",function(event){
  
    event.preventDefault();

    // Get the train information from the form
    var trainName = $("#trainName").val().trim();
    var dest = $("#dest").val().trim();
    var trainTime = $("#trainTime").val().trim();
    var frequency = $("#frequency").val().trim();

    // clear the input boxes once information in submitted
    $("#trainName").val("");
    $("#dest").val("");
    $("#trainTime").val("");
    $("#frequency").val("");

    // Store the train information to Firebase Database in JSON properties 
    // trainName,destination,trainTime,frequency
    database.ref().push({
      
      trainName: trainName,
      destination:dest,
      trainTime:trainTime,
      frequency:frequency
      
    });

  });

 
  // .on("child_added") function to retrieve the data from the database (both initially and every time something new is added)
  // This will then store the data inside the variable "childSnapshot" and runs for every child record in the database.
  database.ref().on("child_added", function(childSnapshot) {

    // retrieve the frequency from the childSnapshot
    var tFrequency = childSnapshot.val().frequency;

    // retrieve the firstTime from the childSnapshot
    var firstTime = childSnapshot.val().trainTime;
    //console.log(firstTime);

    // First Time (pushed back 1 year to make sure it comes before current time)
    var firstTimeConverted = moment(firstTime, "hh:mm").subtract(1, "years");
    //console.log(firstTimeConverted);

    // Current Time from moment object
    var currentTime = moment();
    //console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

    // Difference between both the times
    var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
    //console.log("DIFFERENCE IN TIME: " + diffTime);

    // Time apart in minutes (remainder)
    var tRemainder = diffTime % tFrequency;
    //console.log(tRemainder);

    // Minutes Until the Next Train
    var tMinutesTillTrain = tFrequency - tRemainder;
    //console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

    // Next Train Arrival time
    var nextTrain = moment().add(tMinutesTillTrain, "minutes");
    //console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm"));

    // Display all the train information in the result table
    $(".table").append("<tr class='table-rows'><td> " + 
      childSnapshot.val().trainName +"</td> <td>" + 
      childSnapshot.val().destination +" </td><td>"+
      childSnapshot.val().frequency+"</td><td>"+
      (moment(nextTrain).format("hh:mm A"))+"</td><td>"+
      tMinutesTillTrain+"</td></tr>");

    },
    //If there is an error that Firebase runs into -- it will be stored in the "errorObject"
    function(errorObject) {

      // In case of error this will print the error
      console.log("The read failed: " + errorObject.code);
    });

  //Onclick of Clear button ,clear the form
  $("#clear").on("click",function(){

    $("#trainName").val("");
    $("#dest").val("");
    $("#trainTime").val("");
    $("#frequency").val("");

  });


  // Display current day,date and time 
  tday=new Array("Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday");
  tmonth=new Array("January","February","March","April","May","June","July","August","September","October","November","December");

  function GetClock(){
    
    var d=new Date();
    var nday=d.getDay(),nmonth=d.getMonth(),ndate=d.getDate(),nyear=d.getYear();
    if(nyear<1000) nyear+=1900;
    var nhour=d.getHours(),nmin=d.getMinutes(),nsec=d.getSeconds(),ap;

    if(nhour==0)
      {
        ap=" AM";
        nhour=12;
      }
      else if(nhour<12)
        {
          ap=" AM";
        }
        else if(nhour==12)
          {
            ap=" PM";
          }
          else if(nhour>12)
            {
              ap=" PM";
              nhour-=12;
            }

    if(nmin<=9) nmin="0"+nmin;
    if(nsec<=9) nsec="0"+nsec;

    document.getElementById('clockbox').innerHTML=""+tday[nday]+", "+tmonth[nmonth]+" "+ndate+", "+nyear+" "+nhour+":"+nmin+":"+nsec+ap+"";
  }

    window.onload=function(){

      GetClock();
      setInterval(GetClock,1000);
    
    }

 