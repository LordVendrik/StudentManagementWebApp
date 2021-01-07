var table = document.querySelector(".table tbody");

var rowLength = table.rows.length;

var CurDate = new Date();


// change the color of Ending Session
for(var i=0; i<rowLength; i+=1){
  var row = table.rows[i];

   var actualdays = FindDays(row);

  if(actualdays < 2){                                                //if less than 2 then must renew color red
      row.cells[5].className = "EndedSession";
  }
  if(actualdays <= 5 && actualdays >= 2){                            //if more than 2 and less than 5 then should renew color yellow
      row.cells[5].className = "NearEndedSession";
  }
}


// Change the table according to the selected dropdown Menu
function SortTable(){
    var e = document.getElementById("SortBySessionType");

    if(e.value == "SessionEnd"){

        for(var i=0; i<rowLength; i+=1){                                                   //Looping thorugh rows in the Table variable given above
            var row = table.rows[i];
          
            var actualdays = FindDays(row);

            if(actualdays > 5){                                            //hide all those students who have more than 5 days left to renew session
                row.className = "FilterEndSession";
            }else{                                                         //unhide others                      
                row.className = "";  
            }
        }

    }
    else if(e.value == "All"){                                          //unhide all if selected value is all
        for(var j=0; j<rowLength; j+=1){
            var row2 = table.rows[j];
            row2.className = "";         
        }
    }
    else if(e.value == "SessionNotEnd"){                                
        for(var k=0; k<rowLength; k+=1){
            var row3 = table.rows[k];

            var actualdays3 = FindDays(row3);
 
            if(actualdays3 <= 5){                                       //hide all those students who have less than 5 days left to renew session
                row3.className = "FilterEndSession";
            }else{                                                     //unhide others  
                row3.className = "";  
            }
    }
}
}




//function to check how many days are there between two dates
function FindDays(row){                                                   
    var EndDate = new Date(row.cells[5].textContent);    
    var numberOfMs = EndDate.getTime() - CurDate.getTime();
    var numberOfDays = numberOfMs/(1000*60*60*24);
    var actualdays = Math.floor(numberOfDays) + 1;                        //1 is added to make round off more accurate
    return actualdays;
}


//Seach Bar
function Search(){
    var SearchText = document.getElementById("SearchBox").value;              //taking searchbar input
    var SelectionBox = document.getElementById("SortBySessionType").value = "All"; 

    if(SearchText !== "*"){                                                //checking if search bar is null
        for(var i=0; i<rowLength; i+=1){                                     
            var row = table.rows[i];
                
            var regex = new RegExp(SearchText,"i");                         //changing string to regex and using "i" for case insensitive

            if(regex.test(row.cells[1].textContent)){                 //if regex matches the string in table's cell then show otherwise hide         
                row.className = "";
            }else{                                                                            
                row.className = "FilterEndSession";  
            }
    
        }
    }

}
