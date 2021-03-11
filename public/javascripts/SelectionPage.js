function validateMySelectionForm(){
    var JoinDate = document.getElementById("JoinDate").value;
    var EndingDate = document.getElementById("EndingDate").value;
    var Fees = document.getElementById("Fees").value;
    var PaymentMode = document.querySelector('input[name="PaymentMode"]:checked');

    if(PaymentMode){
        if(JoinDate){
            if(EndingDate){
                if(Fees){
                    console.log("submitted");
                    return true;
                }
                else{
                        document.getElementById("Fees").style.border = "1px solid red";
                        document.getElementById("EndingDate").style.border = "none";
                        document.getElementById("JoinDate").style.border = "none";
                        document.getElementById("SelectionBorder").style.border = "none";
                        window.scrollTo(0, 0);
                        console.log("Not submitted");
                        return false;
                }
            }else{
                document.getElementById("EndingDate").style.border = "1px solid red";
                document.getElementById("JoinDate").style.border = "none";
                document.getElementById("Fees").style.border = "none";
                document.getElementById("SelectionBorder").style.border = "none";
                window.scrollTo(0, 0);
                console.log("Not submitted");
                return false;
            }
        }else{
            document.getElementById("JoinDate").style.border = "1px solid red";
            document.getElementById("EndingDate").style.border = "none";
            document.getElementById("SelectionBorder").style.border = "none";
            window.scrollTo(0, 0);
            console.log("Not submitted");
            return false;
        }
    }else{
        document.getElementById("SelectionBorder").style.border = "1px solid red";
        window.scrollTo(0, 0);
        console.log("Not submitted");
        return false;
    }
}

function SetValue(){
    var Endday = new Date(document.getElementById("JoinDate").value);

    Endday.setDate(Endday.getDate() + 1);
    
    document.getElementById("JoinDate").value = Endday.toISOString().substr(0, 10);

    var EndDate = document.getElementById("EndingDate");

    if(Endday.getMonth() == 2 || Endday.getMonth() == 4 || Endday.getMonth() == 6 || Endday.getMonth() == 7 || Endday.getMonth() == 9 || Endday.getMonth() == 11){
        Endday.setDate(Endday.getDate() + 30);
    }else if(Endday.getMonth() == 3 || Endday.getMonth() == 5 || Endday.getMonth() == 8 || Endday.getMonth() == 10){
        Endday.setDate(Endday.getDate() + 29);
    }else if(Endday.getMonth() == 1){
        Endday.setDate(Endday.getDate() + 27);
    }else if(Endday.getMonth() == 0){
        if(Endday.getDate() <= 29){
            Endday.setDate(Endday.getDate() + 30);
        }else if(Endday.getDate() == 30){
            Endday.setDate(Endday.getDate() + 29);
        }else{
            Endday.setDate(Endday.getDate() + 28);
        }
    }

    EndDate.value = Endday.toISOString().substr(0, 10);
}

SetValue();