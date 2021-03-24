
//jshint esversion:6
var table = document.querySelector(".table tbody");

var rowLength = table.rows.length;

var total = document.querySelector(".table tfoot");

var totalPrice = 0;

var totalExp = 0;

var totalAdvance = 0;

var totalBalance = 0;

var DateOfJoinsArray = [];

var online = 0;
var offline = 0;

for(var i = 0;i < rowLength; i++){
    DateOfJoinsArray.push(table.rows[i].cells[2].textContent);
}

for(var i = 0;i < rowLength; i++){
    if(table.rows[i].cells[5].textContent){
        if(table.rows[i].cells[5].textContent != "0"){
            table.rows[i].cells[5].bgColor = "Cyan";
        }
    }
}

for(var i = 0;i < rowLength; i++){
    if(table.rows[i].cells[0].textContent){
        if(table.rows[i].cells[7].textContent){
            if(table.rows[i].cells[7].textContent == "Online"){
                table.rows[i].cells[7].className = "Online";
                online = online + parseInt(table.rows[i].cells[3].textContent);
            }else{
                offline = offline + parseInt(table.rows[i].cells[3].textContent);
            }
        }else{
            offline = offline + parseInt(table.rows[i].cells[3].textContent);
        }
    }
}

document.getElementById("NumberOnline").innerHTML = "Online : "+online +" "+" Offline : " + offline + " ";

function SeprateBalance(){
    for(var i = 0;i < rowLength; i++){
        if(table.rows[i].cells[5].textContent){
            if(table.rows[i].cells[5].textContent != "0"){
                table.rows[i].className = "";
            }
            else{
                table.rows[i].className = "FilterEndSession";
            }
        }else{
            table.rows[i].className = "FilterEndSession";
        }
    }
}

function CalculateTotalAccToDate(){

    for(var j=0; j < rowLength; j++){
        table.rows[j].className = "";
    }

    var Date1 = new Date(document.getElementById("date1").value);
    var Date2 = new Date(document.getElementById("date2").value);
    totalPrice = 0;
    totalExp = 0;
    totalAdvance = 0;
    totalBalance = 0;
    online = 0;
    offline = 0;

    if(Date1 && Date2){
        for(var i=0; i < rowLength; i++){
            var PersonJoinDate = new Date(DateOfJoinsArray[i]);

            if(Date1.getTime() <= PersonJoinDate.getTime() && Date2.getTime() >= PersonJoinDate.getTime()){
                table.rows[i].className = "";

                //cal online offline total
                if(table.rows[i].cells[7].textContent){
                    if(table.rows[i].cells[3].textContent){
                        if(table.rows[i].cells[7].textContent == "Online"){
                            online = online + parseInt(table.rows[i].cells[3].textContent);
                        }else{
                            offline = offline + parseInt(table.rows[i].cells[3].textContent);
                            console.log(table.rows[i].cells[3].textContent);
                        }
                    }
                }else{
                    if(table.rows[i].cells[3].textContent){
                        offline = offline + parseInt(table.rows[i].cells[3].textContent);
                    }
                }

                document.getElementById("NumberOnline").innerHTML = "Online : "+online +" "+" Offline : " + offline + " ";
                //cal online offline total

                if(table.rows[i].cells[0].textContent && table.rows[i].cells[3].textContent){
                    totalPrice = totalPrice + parseInt(table.rows[i].cells[3].textContent,10);

                    if(table.rows[i].cells[4].textContent){
                        totalAdvance = totalAdvance + parseInt(table.rows[i].cells[4].textContent,10);
                    }

                    if(table.rows[i].cells[5].textContent){
                        totalBalance = totalBalance + parseInt(table.rows[i].cells[5].textContent,10);
                    }
                }else if(!table.rows[i].cells[0].textContent && table.rows[i].cells[6].textContent){
                    totalExp = totalExp + parseInt(table.rows[i].cells[6].textContent,10);
                }
            }else{
                table.rows[i].className = "FilterEndSession";
            }
        }

        console.log(total.rows[0].cells[3].innerHTML);

        total.rows[0].cells[1].innerHTML = "<h4><Strong>"+ totalPrice +"</Strong></h4>";
        total.rows[0].cells[2].innerHTML = "<h4><Strong>"+ totalAdvance +"</Strong></h4>";
        total.rows[0].cells[3].innerHTML = "<h4><Strong>"+ totalBalance +"</Strong></h4>";
        total.rows[0].cells[4].innerHTML = "<h4><Strong>"+ totalExp +"</Strong></h4>";
    }

    console.log(document.getElementsByClassName("subtract-expense"));

    document.getElementById("subtract-expense").classList.remove("FilterEndSession");

    window.scroll(0,1080);
}


function Subtract(){
    var Remainder = totalPrice - totalExp;

    total.rows[0].cells[1].innerHTML = "<h4><Strong><strike>"+ totalPrice +"</strike></Strong></h4>" +"<h4><Strong>"+ Remainder+"</Strong></h4>";
}


for(var i=0;i<rowLength;i++)
{
    if(!table.rows[i].cells[5].textContent || table.rows[i].cells[5].textContent == 0){
        if(table.rows[i].cells[0].textContent){
        document.getElementById("deletePrice" + i).classList.add("inactiveLink");
        }
    }
}