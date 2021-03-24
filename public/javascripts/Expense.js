var table = document.querySelector(".table tbody");

var rowLength = table.rows.length;

var online = 0;
var offline = 0;


for(var i = 0;i < rowLength; i++){
        if(table.rows[i].cells[4].textContent){
            if(table.rows[i].cells[4].textContent == "Online"){
                table.rows[i].cells[4].bgColor = "Orange";
                online = online + parseInt(table.rows[i].cells[3].textContent);
            }else{
                offline = offline + parseInt(table.rows[i].cells[3].textContent);
            }
        }else{
            offline = offline + parseInt(table.rows[i].cells[3].textContent);
        }
}

document.getElementById("NumberOnline").innerHTML = "Online : "+online +"  "+" Offline : " + offline + " ";

function ValidateMyForm(){

    var ExpenseDate = document.getElementById("ExpenseDate").value;
    var ExpensePrice = document.getElementById("ExpensePrice").value;
    var PaymentMode = document.querySelector('input[name="PaymentMode"]:checked');


    if(PaymentMode){
        if(ExpenseDate){
                if(ExpensePrice){
                    console.log("submitted");
                    return true;
                }else{
                    document.getElementById("ExpensePrice").style.border = "1px solid red";
                    document.getElementById("ExpenseDate").style.border = "none";
                    document.getElementById("ExpenseBorder").style.border = "none";
                    return false;
                }
        }else{
            document.getElementById("ExpenseDate").style.border = "1px solid red";
            document.getElementById("ExpenseBorder").style.border = "none";
            return false;
        }
    }else{
        document.getElementById("ExpenseBorder").style.border = "1px solid red";
        window.scrollTo(0, 0);
        console.log("Not submitted");
        return false;
    }
}