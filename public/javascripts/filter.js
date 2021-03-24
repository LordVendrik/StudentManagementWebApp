
var table = document.querySelector(".table tbody");

var rowLength = table.rows.length;

var CurDate = new Date();

var RealFrom = 0;
var RealTo = 0;
var DefaultFrom = 0;
var DefaultTo = 0;
var NoOfStudents = rowLength;


if (window.performance) {
    var navEntries = window.performance.getEntriesByType('navigation');
    if (navEntries.length > 0 && navEntries[0].type === 'back_forward') {
        if(localStorage.getItem("value")){

            document.getElementById("SortBySessionType").value = localStorage.getItem("value");
            console.log(document.getElementById("SortBySessionType").value);
            SortTable();
        }
    } else if (window.performance.navigation
         && window.performance.navigation.type == window.performance.navigation.TYPE_BACK_FORWARD) {
            if(localStorage.getItem("value")){

                document.getElementById("SortBySessionType").value = localStorage.getItem("value");
                console.log(document.getElementById("SortBySessionType").value);
                SortTable();
            }
    } else {
        document.getElementById("SortBySessionType").value = localStorage.getItem("value");
        console.log(document.getElementById("SortBySessionType").value);
        SortTable();
    }
} else {
    console.log("Unfortunately, your browser doesn't support this API");
}



// change the color of Ending Session
for(var i=0; i<rowLength; i+=1){
  var row = table.rows[i];

   var actualdays = FindDays(row);

  if(actualdays < 0){                                                //if less than 0 then must renew color red
      row.cells[7].className = "EndedSession";
  }
  if(actualdays <= 5 && actualdays >= 0){                            //if more than 0 and less than 5 then should renew color yellow
      row.cells[7].className = "NearEndedSession";
  }
}
// change the color of Ending Session













//Initially set Number of Students
document.getElementById("StudentNumber").textContent = "Total No. of Students are : "+NoOfStudents;
//Initially set Number of Students














// Change the table according to the selected dropdown Menu
function SortTable(){
    var e = document.getElementById("SortBySessionType");

    localStorage.setItem("value",e.value);

    if(e.value == "SessionEnd"){

        document.getElementById("OtherTimeFilter").classList.add("FilterEndSession");  
        NoOfStudents = 0;
        
        for(var i=0; i<rowLength; i+=1){                                                   //Looping thorugh rows in the Table variable given above
            var row = table.rows[i];
          
            var actualdays = FindDays(row);

            if(actualdays >= 0){                                            //hide all those students who have more than 0 days left to renew session
                row.className = "FilterEndSession";                          //FilterEnd Session ==== Hide Student
            }else{                                                         //unhide others                      
                row.className = "";                                          // ""    ===== Unhide Student
                NoOfStudents++;
            }
        }
        document.getElementById("StudentNumber").textContent = "Total No. of Students are : "+NoOfStudents;
    }//////////////////////////////        Process based on Session Nearly End from Sort Menu
    else if(e.value == "SessionNearlyEnd"){ 
        document.getElementById("OtherTimeFilter").classList.add("FilterEndSession");           
        NoOfStudents = 0;                    
        for(var k=0; k<rowLength; k+=1){
            var row3 = table.rows[k];

            var actualdays3 = FindDays(row3);
 
            if(actualdays3 > 5 || actualdays3 < 0){                                       
                row3.className = "FilterEndSession";                      //FilterEnd Session ==== Hide Student
            }else{                                                      
                row3.className = "";                                     // ""    ===== Unhide Student
                NoOfStudents++;
            }
        }
        document.getElementById("StudentNumber").textContent = "Total No. of Students are : "+NoOfStudents;
    }//////////////////////////////        Process based on Reserved Seat from Sort Menu
    else if(e.value == "Reserved"){
        document.getElementById("OtherTimeFilter").classList.add("FilterEndSession"); 
        NoOfStudents = 0;

        var NonReserved = document.querySelectorAll("#NonReservedSeat");
        var Reserved = document.querySelectorAll("#ReservedSeat");

        console.log(document.querySelectorAll("#NonReservedSeat"));

        for(var j=0; j<NonReserved.length; j+=1){
            NonReserved[j].className = "FilterEndSession";
            NoOfStudents = rowLength - NonReserved.length;
        }

        for(var j=0; j<Reserved.length; j+=1){
            Reserved[j].className = "";
        }

        document.getElementById("StudentNumber").textContent = "Total No. of Students are : "+NoOfStudents;
    }//////////////////////////         Process based on All from Sort Menu
    else if(e.value == "All"){                                                         //unhide all if selected value is all
        document.getElementById("OtherTimeFilter").classList.add("FilterEndSession");  
        for(var j=0; j<rowLength; j+=1){
            var row2 = table.rows[j];
            row2.className = "";         
        }
        document.getElementById("StudentNumber").textContent = "Total No. of Students are : "+rowLength;
    }//////////////////////////           Process based on Session Not End from Sort Menu
    else if(e.value == "SessionNotEnd"){ 
        document.getElementById("OtherTimeFilter").classList.add("FilterEndSession");           
        NoOfStudents = 0;                    
        for(var k=0; k<rowLength; k+=1){
            var row3 = table.rows[k];

            var actualdays3 = FindDays(row3);
 
            if(actualdays3 <= 5){                                       
                row3.className = "FilterEndSession";                      //FilterEnd Session ==== Hide Student
            }else{                                                      
                row3.className = "";                                     // ""    ===== Unhide Student
                NoOfStudents++;
            }
        }
        document.getElementById("StudentNumber").textContent = "Total No. of Students are : "+NoOfStudents;
    }////////////////////////              Process based on Morning Shift from Sort Menu
    else if(e.value == "Morning"){
        document.getElementById("OtherTimeFilter").classList.add("FilterEndSession");  

        NoOfStudents = 0;   

        for(var l=0;l<rowLength;l++){
            var row4 = table.rows[l];

            DefaultFrom = getDayTimeAsNumberOfMinutes("08:00");
            DefaultTo = getDayTimeAsNumberOfMinutes("14:00");

            if(row4.cells[4].textContent > row4.cells[5].textContent)
            {
                RealFrom = getDayTimeAsNumberOfMinutes(row4.cells[4].textContent);
                RealTo = getNightTimeAsNumberOfMinutes(row4.cells[5].textContent);
            }else{
                RealFrom = getDayTimeAsNumberOfMinutes(row4.cells[4].textContent);
                RealTo = getDayTimeAsNumberOfMinutes(row4.cells[5].textContent);
            }

            if((DefaultFrom >= RealFrom && DefaultFrom < RealTo) || (DefaultTo > RealFrom && DefaultTo <= RealTo)|| (RealFrom > DefaultFrom && RealFrom < DefaultTo) || (RealTo > DefaultFrom && RealTo < DefaultTo)){
                row4.className = "";
                NoOfStudents++;
            }else if (RealFrom === RealTo){
                row4.className = "";
                NoOfStudents++;
            }
            else{
                row4.className = "FilterEndSession";
            }
        }
        document.getElementById("StudentNumber").textContent = "Total No. of Students are : "+NoOfStudents;
        DefaultFrom = 0;
        DefaultTo = 0;
        RealFrom = 0;
        RealTo = 0;
    }////////////////////////////                  Process based on Evening Shift from Sort Menu
    else if (e.value == "Evening"){
        document.getElementById("OtherTimeFilter").classList.add("FilterEndSession"); 

        NoOfStudents = 0; 

        for(var m=0;m<rowLength;m++){
            var row5 = table.rows[m];

            DefaultFrom = getDayTimeAsNumberOfMinutes("14:00");
            DefaultTo = getDayTimeAsNumberOfMinutes("20:00");

            if(row5.cells[4].textContent > row5.cells[5].textContent)
            {
                RealFrom = getDayTimeAsNumberOfMinutes(row5.cells[4].textContent);
                RealTo = getNightTimeAsNumberOfMinutes(row5.cells[5].textContent);
            }else{
                RealFrom = getDayTimeAsNumberOfMinutes(row5.cells[4].textContent);
                RealTo = getDayTimeAsNumberOfMinutes(row5.cells[5].textContent);
            }

            if((DefaultFrom >= RealFrom && DefaultFrom < RealTo) || (DefaultTo > RealFrom && DefaultTo <= RealTo) || (RealFrom > DefaultFrom && RealFrom < DefaultTo) || (RealTo > DefaultFrom && RealTo < DefaultTo)){
                row5.className = "";
                NoOfStudents++;
            }else if (RealFrom === RealTo){
                row5.className = "";
                NoOfStudents++;
            }
            else{
                row5.className = "FilterEndSession";
            }
        }
        document.getElementById("StudentNumber").textContent = "Total No. of Students are : "+NoOfStudents;
        DefaultFrom = 0;
        DefaultTo = 0;
        RealFrom = 0;
        RealTo = 0;
    }//////////////////////////////                         Process based on Night Shift from Sort Menu
    else if (e.value == "Night"){
        document.getElementById("OtherTimeFilter").classList.add("FilterEndSession"); 
        NoOfStudents = 0; 
        for(var n=0;n<rowLength;n++){
            var row6 = table.rows[n];

            DefaultFrom = getDayTimeAsNumberOfMinutes("20:00");
            DefaultTo = getNightTimeAsNumberOfMinutes("08:00");

            if(row6.cells[4].textContent > row6.cells[5].textContent)
            {
                RealFrom = getDayTimeAsNumberOfMinutes(row6.cells[4].textContent);
                RealTo = getNightTimeAsNumberOfMinutes(row6.cells[5].textContent);
            }else{
                RealFrom = getDayTimeAsNumberOfMinutes(row6.cells[4].textContent);
                RealTo = getDayTimeAsNumberOfMinutes(row6.cells[5].textContent);
            }

            if((DefaultFrom >= RealFrom && DefaultFrom < RealTo) || (DefaultTo > RealFrom && DefaultTo <= RealTo) || (RealFrom > DefaultFrom && RealFrom < DefaultTo) || (RealTo > DefaultFrom && RealTo < DefaultTo)){
                row6.className = "";
                NoOfStudents++;
            }else if (RealFrom === RealTo){
                row6.className = "";
                NoOfStudents++;
            }
            else{
                row6.className = "FilterEndSession";
            }
        }
        document.getElementById("StudentNumber").textContent = "Total No. of Students are : "+NoOfStudents;
        DefaultFrom = 0;
        DefaultTo = 0;
        RealFrom = 0;
        RealTo = 0;
    }///////////////////////////////                          Process based on Full time from Sort Menu
    else if (e.value == "FullTime"){
        document.getElementById("OtherTimeFilter").classList.add("FilterEndSession"); 
        NoOfStudents = 0;
        for(var o=0;o<rowLength;o++){
            var row7 = table.rows[o];

            DefaultFrom = getDayTimeAsNumberOfMinutes("08:00");
            DefaultTo = getDayTimeAsNumberOfMinutes("20:00");

            if(row7.cells[4].textContent > row7.cells[5].textContent)
            {
                RealFrom = getDayTimeAsNumberOfMinutes(row7.cells[4].textContent);
                RealTo = getNightTimeAsNumberOfMinutes(row7.cells[5].textContent);
            }else{
                RealFrom = getDayTimeAsNumberOfMinutes(row7.cells[4].textContent);
                RealTo = getDayTimeAsNumberOfMinutes(row7.cells[5].textContent);
            }

            if((DefaultFrom >= RealFrom && DefaultFrom < RealTo) || (DefaultTo > RealFrom && DefaultTo <= RealTo) || (RealFrom > DefaultFrom && RealFrom < DefaultTo) || (RealTo > DefaultFrom && RealTo < DefaultTo)){
                row7.className = "";
                NoOfStudents++;
            }else if (RealFrom === RealTo){
                row7.className = "";
                NoOfStudents++;
            }
            else{
                row7.className = "FilterEndSession";
            }
        }
        document.getElementById("StudentNumber").textContent = "Total No. of Students are : "+NoOfStudents;
        DefaultFrom = 0;
        DefaultTo = 0;
        RealFrom = 0;
        RealTo = 0;
    }////////////////////////////////                 Process based on 24 hour Shift from Sort Menu
    else if(e.value == "24Hour"){
        for(var p=0;p<rowLength;p++){
            var row8 = table.rows[p];
            row8.className = "";                        //Unhide all
        }
        document.getElementById("StudentNumber").textContent = "Total No. of Students are : "+rowLength;
    }//////////////////////////////////            Process based on Other Shift from Sort Menu
    else if(e.value == "Other"){
        document.getElementById("OtherTimeFilter").classList.remove("FilterEndSession");
    }

}
// Change the table according to the selected dropdown Menu
















//Check time if Other selected from dropdown
function CheckTimeFromOther(){

    var DefaultFrom2 = 0;
    var DefaultTo2 = 0;

    DefaultFrom2 = getNightTimeAsNumberOfMinutes(document.getElementById("OtherTimeFilterFrom").value);
    DefaultTo2 = getNightTimeAsNumberOfMinutes(document.getElementById("OtherTimeFilterTo").value);

    NoOfStudents = 0;

    for(var n=0;n<rowLength;n++){
        var row6 = table.rows[n];

        if(document.getElementById("OtherTimeFilterFrom").value > document.getElementById("OtherTimeFilterTo").value)
        {
            DefaultFrom = getDayTimeAsNumberOfMinutes(document.getElementById("OtherTimeFilterFrom").value);
            DefaultTo = getNightTimeAsNumberOfMinutes(document.getElementById("OtherTimeFilterTo").value);
        }else{
            DefaultFrom = getDayTimeAsNumberOfMinutes(document.getElementById("OtherTimeFilterFrom").value);
            DefaultTo = getDayTimeAsNumberOfMinutes(document.getElementById("OtherTimeFilterTo").value);
        }

        if(row6.cells[4].textContent > row6.cells[5].textContent)
        {
            RealFrom = getDayTimeAsNumberOfMinutes(row6.cells[4].textContent);
            RealTo = getNightTimeAsNumberOfMinutes(row6.cells[5].textContent);
        }else{
            RealFrom = getDayTimeAsNumberOfMinutes(row6.cells[4].textContent);
            RealTo = getDayTimeAsNumberOfMinutes(row6.cells[5].textContent);
        }

        console.log(document.getElementById("OtherTimeFilterFrom").value);
        console.log(document.getElementById("OtherTimeFilterTo").value);
        console.log(row6.cells[4].textContent);
        console.log(row6.cells[5].textContent);


        if((DefaultFrom >= RealFrom && DefaultFrom < RealTo) || (DefaultTo > RealFrom && DefaultTo <= RealTo) || (RealFrom > DefaultFrom && RealFrom < DefaultTo) || (RealTo > DefaultFrom && RealTo < DefaultTo)){
            row6.className = "";
            NoOfStudents++;
        }else if((DefaultFrom2 >= RealFrom && DefaultFrom2 < RealTo) || (DefaultTo2 > RealFrom && DefaultTo2 <= RealTo) || (RealFrom > DefaultFrom2 && RealFrom < DefaultTo2) || (RealTo > DefaultFrom2 && RealTo < DefaultTo2)){
            row6.className = "";
            NoOfStudents++;
        }else if (RealFrom === RealTo){
            row6.className = "";
            NoOfStudents++;
        }
        else{
            row6.className = "FilterEndSession";
        }
    }
    document.getElementById("StudentNumber").textContent = "Total No. of Students are : "+NoOfStudents;
    DefaultFrom = 0;
    DefaultTo = 0;
    RealFrom = 0;
    RealTo = 0;
}
//Check time if Other selected from dropdown






















//function to check how many days are there between two dates
function FindDays(row){                                                   
    var EndDate = new Date(row.cells[7].textContent);    
    var numberOfMs = EndDate.getTime() - CurDate.getTime();
    var numberOfDays = numberOfMs/(1000*60*60*24);
    var actualdays = Math.floor(numberOfDays) + 1;                        //1 is added to make round off more accurate
    return actualdays;
}
//function to check how many days are there between two dates









//Convert Time to epoch time
function getDayTimeAsNumberOfMinutes(time)
{
    var timeParts = time.split(":");

    var timeInMinutes = new Date("2021/2/10");

    timeInMinutes.setHours(timeParts[0],timeParts[1]);

    return timeInMinutes.getTime();
}

function getNightTimeAsNumberOfMinutes(time)
{
    var timeParts = time.split(":");

    var timeInMinutes = new Date("2021/2/11");

    timeInMinutes.setHours(timeParts[0],timeParts[1]);

    return timeInMinutes.getTime();
}
//Convert Time to epoch time


















//Seach Bar
function Search(){
    var SearchText = document.getElementById("SearchBox").value;              //taking searchbar input

    if(document.getElementById('SortBySessionType')){
        var SelectionBox = document.getElementById("SortBySessionType").value = "All"; 
    }

    console.log(SearchText);

    if(SearchText){                                                //checking if search bar is null
        for(var i=0; i<rowLength; i+=1){                                     
            var row = table.rows[i];
                
            var regex = new RegExp(SearchText,"i");                         //changing string to regex and using "i" for case insensitive

            if(isNaN(SearchText)){
                if(regex.test(row.cells[1].textContent)){                 //if regex matches the string in table's cell then show otherwise hide         
                row.className = "";
                }else{                                                                            
                    row.className = "FilterEndSession";  
                }
            }else{    
                if(row.cells[0].textContent === SearchText){                 //if regex matches the string in table's cell then show otherwise hide         
                    row.className = "";
                }else{                                                                            
                    row.className = "FilterEndSession";  
                } 
            }
        }
    }else{
        for(var i=0; i<rowLength; i+=1){
            var row = table.rows[i];
            row.className = "";  
        }
    }
}
//Seach Bar

















//Activate or inactivate Renew Button in list
for(var i = 0; i < rowLength;i++){
    var EndDate = FindDays(table.rows[i]);

    if(EndDate >= 0){
        document.getElementById("RenewFees" + i).classList.add("inactiveLink");
    }
    
}
//Activate or inactivate Renew Button in list