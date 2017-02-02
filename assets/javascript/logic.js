//Display current Date and Time on load of html page
window.onload=function(){

      GetClock();
      setInterval(GetClock,1000);
    
  }

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

  var count = 0;

  // .on("child_added") function to retrieve the data from the database (both initially and every time something new is added)
  // This will then store the data inside the variable "childSnapshot" and runs for every child record in the database.

  database.ref().on("child_added", function(childSnapshot) {

    count++;

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
    var diffTime = moment().diff(moment(firstTimeConverted,"hh:mm"), "minutes");
    //console.log("DIFFERENCE IN TIME: " + diffTime);

    // Time apart in minutes (remainder)
    var tRemainder = diffTime % tFrequency;
    //console.log(tRemainder);

    // Minutes Until the Next Train
    var tMinutesTillTrain = tFrequency - tRemainder;
    //console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

    // Next Train Arrival time
    var nextTrain = moment().add(tMinutesTillTrain, "minutes");
    var nextTrainArrival = moment(nextTrain).format("hh:mm A");
    //console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm"));

    // Display all the train information in the result table
    $(".table").append("<tr id=row"+count+" class='table-rows' value="+childSnapshot.key+"><td id=name"+count+">" + 
      childSnapshot.val().trainName +"</td> <td id=dest"+count+">" + 
      childSnapshot.val().destination +" </td><td id=freq"+count+">"+
      childSnapshot.val().frequency+"</td><td id=arrival"+count+">"+
      nextTrainArrival+"</td><td id=mins"+count+">"+
      tMinutesTillTrain+"</td><td><a id=edit_link"+count+" href='#' onclick='edit_row("+count+");' class='myButton' >Update</a><a id=save_link"+count+" href='#' onclick='save_row("+count+");' class='myButton' style='display:none'>Save</a></td><td><a href='#'' onclick='delete_row("+count+");' class='myButton'>Delete</a></td></tr>");

    if(tMinutesTillTrain < 2 )
      {
        document.getElementById("mins"+count).className = "heart";
        document.getElementById("mins"+count).innerHTML = "Arriving"
      }
    else if(tMinutesTillTrain === 0)
      {
        document.getElementById("mins"+count).innerHTML = "Arrived";
        document.getElementById("mins"+count).style.color = "green";
        setTimeout(displayStatus,3000);
      }
      
        
      
      


    },
    //If there is an error that Firebase runs into -- it will be stored in the "errorObject"
    function(errorObject) {

      // In case of error this will print the error
      console.log("The read failed: " + errorObject.code);
    });

  function displayStatus()
  {
    document.getElementById("mins"+count).className="";
  }

  //Onclick of Clear button ,clear the form
  $("#clear").on("click",function(){

    $("#trainName").val("");
    $("#dest").val("");
    $("#trainTime").val("");
    $("#frequency").val("");

  });

  // Display current day,date and time 
  function GetClock(){
    
    var current_time = moment().format("ddd, MMM DD YYYY, h:mm a");;
    document.getElementById('clockbox').innerHTML = current_time;
  }

  // edit row function invoked when clicked on update button
  function edit_row(no)
  {
 
    document.getElementById("edit_link"+no).style.display = "none";
    document.getElementById("save_link"+no).style.display = "block";
  
    //get the input type text
    var train_name = document.getElementById("name"+no);
    var destination = document.getElementById("dest"+no);
    var arrival_time = document.getElementById("arrival"+no);
  
    //save the current values of train name,destination and arrival time 
    //inside the table into new variables
    var name_data = train_name.innerHTML;
    var dest_data = destination.innerHTML;
    var arrival_data = arrival_time.innerHTML; 

    // create the input type text to be edited by the user
    train_name.innerHTML = "<input type='text' id='train_name_text"+no+"' value='"+name_data+"'>";
    destination.innerHTML = "<input type='text' id='destination_text"+no+"' value='"+dest_data+"'>";
    arrival_time.innerHTML = "<input type='text' id='arrival_time_text"+no+"' value='"+arrival_data+"'>";

    //define styles for the input types text
    document.getElementById('train_name_text'+no).style.width = "180px";
    document.getElementById('train_name_text'+no).style.backgroundColor = "#87CEEB ";
    document.getElementById('train_name_text'+no).style.color = "#000080";
 
    document.getElementById('destination_text'+no).style.width = "150px";
    document.getElementById('destination_text'+no).style.backgroundColor = "#87CEEB ";
    document.getElementById('destination_text'+no).style.color = "#000080";
 
    document.getElementById('arrival_time_text'+no).style.width = "80px";
    document.getElementById('arrival_time_text'+no).style.backgroundColor = "#87CEEB ";
    document.getElementById('arrival_time_text'+no).style.color = "#000080";

  }

  // function to save the changes made by the user
 function save_row(no)
  {
    //save the new values entered by the user
    var train_val = document.getElementById("train_name_text"+no).value;
    var destination_val = document.getElementById("destination_text"+no).value;
    var arrival_val = document.getElementById("arrival_time_text"+no).value;

    var update_key = $("#row"+no).attr("value");

    document.getElementById("name"+no).innerHTML = train_val;
    document.getElementById("dest"+no).innerHTML = destination_val;
    document.getElementById("arrival"+no).innerHTML = arrival_val;

    document.getElementById("edit_link"+no).style.display = "block";
    document.getElementById("save_link"+no).style.display = "none";

    var current_time = moment();
    
    var next_arrival = arrival_val;
    
    var diffTime1 = moment(arrival_val,"hh:mm A").diff(moment(current_time,"hh:mm A"),"minutes");

    document.getElementById("mins"+no).innerHTML = diffTime1+1;
    
    database.ref(update_key).update({
      trainName: train_val,
      destination:destination_val,

    });

  }

  function delete_row(no)
  {
    
    var delete_key = $("#row"+no).attr("value");
    document.getElementById("row"+no+"").outerHTML="";
    database.ref(delete_key).remove();

  }

  setInterval(displayTable,60000);
  function displayTable()
  {

    var tbl = document.getElementById("myTable");
    var x = document.getElementById("myTable").rows.length;

    var childData = [];
    database.ref().on("value", function(snapshot) {
      
      snapshot.forEach(function(childSnapshot) {
      childData.push(childSnapshot.val().trainTime);
      //console.log(childData);
    
      });

    });

    for(var i = 1 ; i < x ; i++)
    { 
      
      var y = document.getElementById("myTable").rows[i].cells.length;

        for(var j = 0 ; j < y ; j++)
          { 
        
            var freq;
            var minutes ;

            if(j === 2)
              { 
          
                freq = document.getElementById("myTable").rows[i].cells[j].innerHTML;
        
              }
            if(j=== 4)
              {
          
                minutes = document.getElementById("myTable").rows[i].cells[j].innerHTML;

        
              }
       
            // retrieve the firstTime from the childSnapshot
            var tablefirstTime = childData[i-1];
     
            // First Time (pushed back 1 year to make sure it comes before current time)
            var tablefirstTimeConverted = moment(tablefirstTime, "hh:mm").subtract(1, "years");
    
            // Current Time from moment object
            //var currentTime = moment();

            // Difference between both the times
            var tdiffTime = moment().diff(moment(tablefirstTimeConverted,"hh:mm"), "minutes");

            // Time apart in minutes (remainder)
            var tableRemainder = tdiffTime % freq;

            // Minutes Until the Next Train
            var tableMinutesTillTrain = freq - tableRemainder;

            // Next Train Arrival time
            var tnextTrain = moment().add(tableMinutesTillTrain, "minutes");
            var tnextTrainArrival = moment(tnextTrain).format("hh:mm A");

            document.getElementById("mins"+i).innerHTML = tableMinutesTillTrain ;
            document.getElementById("arrival"+i).innerHTML = tnextTrainArrival ;


            if(tableMinutesTillTrain < 3 )
              {
                document.getElementById("mins"+i).className = "heart";
              }
              else
                {
                  document.getElementById("mins"+i).className = "";
                }
     
          }
  
    }

  }





 