function isInputNumber(evt){
    var char = String.fromCharCode(evt.which);

    if(!(/[0-9]/.test(char))){
        evt.preventDefault();
    }
}

$('input[type=radio][name=Shift]').change(function() {
    if (this.value == 'Other') {
        document.getElementById("TimingOther").classList.remove("FilterEndSession");
    }
    else if (this.value == 'morning') {
        document.getElementById("TimingOther").classList.add("FilterEndSession");
        document.getElementById("OtherShiftTimingFrom").value = "08:00";
        document.getElementById("OtherShiftTimingTo").value = "14:00";
    }
    else if (this.value == 'evening') {
        document.getElementById("TimingOther").classList.add("FilterEndSession");
        document.getElementById("OtherShiftTimingFrom").value = "14:00";
        document.getElementById("OtherShiftTimingTo").value = "20:00";
    }
    else if (this.value == 'full time') {
        document.getElementById("TimingOther").classList.add("FilterEndSession");
        document.getElementById("OtherShiftTimingFrom").value = "08:00";
        document.getElementById("OtherShiftTimingTo").value = "20:00";
    }
    else if (this.value == 'Night') {
        document.getElementById("TimingOther").classList.add("FilterEndSession");
        document.getElementById("OtherShiftTimingFrom").value = "20:00";
        document.getElementById("OtherShiftTimingTo").value = "08:00";
    }
    else if (this.value == '24Hour') {
        document.getElementById("TimingOther").classList.add("FilterEndSession");
        document.getElementById("OtherShiftTimingFrom").value = "08:00";
        document.getElementById("OtherShiftTimingTo").value = "08:00";
    }
});

$('input[type=radio][name=Reservation]').change(function() {
    if (this.value == 'Yes') {
        document.getElementById("ReservedSeatNumber").classList.remove("FilterEndSession");
    }
    else if (this.value == 'No') {
        document.getElementById("ReservedSeatNumber").classList.add("FilterEndSession");
        document.getElementById("ReservedSeatNumber").value = "";
    }
});


function SetValue(){
    var joinday = new Date(document.getElementById("JoinDate").value);

    var EndDate = document.getElementById("EndingDate");

    if(joinday.getMonth() == 2 || joinday.getMonth() == 4 || joinday.getMonth() == 6 || joinday.getMonth() == 7 || joinday.getMonth() == 9 || joinday.getMonth() == 11){
        joinday.setDate(joinday.getDate() + 30);
    }else if(joinday.getMonth() == 3 || joinday.getMonth() == 5 || joinday.getMonth() == 8 || joinday.getMonth() == 10){
        joinday.setDate(joinday.getDate() + 29);
    }else if(joinday.getMonth() == 1){
        joinday.setDate(joinday.getDate() + 27);
    }else if(joinday.getMonth() == 0){
        if(joinday.getDate() <= 29){
            joinday.setDate(joinday.getDate() + 30);
        }else if(joinday.getDate() == 30){
            joinday.setDate(joinday.getDate() + 29);
        }else{
            joinday.setDate(joinday.getDate() + 28);
        }
    }

    console.log(joinday.getMonth());

    EndDate.value = joinday.toISOString().substr(0, 10);
}

function validateMyForm(){
    var Name = document.getElementById("Name").value;
    var FatherName = document.getElementById("FatherName").value;
    var PhoneNumber = document.getElementById("PhoneNumber").value;
    var DOJ = document.getElementById("JoinDate").value;
    var EndingDate = document.getElementById("EndingDate").value;
    var ShiftTime = document.querySelector('input[name="Shift"]:checked');
    var PaymentMode = document.querySelector('input[name="PaymentMode"]:checked');
    var Fees = document.getElementById("Fees").value;

    console.log(Name);

    if(PaymentMode){
        if(DOJ){
            if(EndingDate){
                if(ShiftTime){
                    if(Fees){
                        if(Name){
                            if(FatherName){
                                if(PhoneNumber && PhoneNumber.length == 10){
                                    console.log("submitted");
                                    return true;
                                }
                                else{
                                        document.getElementById("PhoneNumber").style.border = "1px solid red";
                                        document.getElementById("FatherName").style.border = "none";
                                        document.getElementById("Name").style.border = "none";
                                        document.getElementById("Fees").style.border = "none";
                                        document.getElementById("border").style.border = "none";
                                        document.getElementById("EndingDate").style.border = "none";
                                        document.getElementById("JoinDate").style.border = "none";
                                        document.getElementById("border2").style = "none";
                                        window.scrollTo(0, 0);
                                        console.log("Not submitted");
                                        return false;
                                }
                            }else{
                                document.getElementById("FatherName").style.border = "1px solid red";
                                document.getElementById("Name").style.border = "none";
                                document.getElementById("Fees").style.border = "none";
                                document.getElementById("border").style.border = "none";
                                document.getElementById("EndingDate").style.border = "none";
                                document.getElementById("JoinDate").style.border = "none";
                                document.getElementById("border2").style = "none";
                                window.scrollTo(0, 0);
                                console.log("Not submitted");
                                return false;
                            }
                        }else{
                            document.getElementById("Name").style.border = "1px solid red";
                            document.getElementById("Fees").style.border = "none";
                            document.getElementById("border").style.border = "none";
                            document.getElementById("EndingDate").style.border = "none";
                            document.getElementById("JoinDate").style.border = "none";
                            document.getElementById("border2").style = "none";
                            window.scrollTo(0, 0);
                            console.log("Not submitted");
                            return false;
                        }
                    }else{
                        document.getElementById("Fees").style.border = "1px solid red";
                        document.getElementById("border").style.border = "none";
                        document.getElementById("EndingDate").style.border = "none";
                        document.getElementById("JoinDate").style.border = "none";
                        document.getElementById("border2").style = "none";
                        window.scrollTo(0, 700);
                        console.log("Fees Not submitted");
                        return false;  
                    }
                }else{
                    document.getElementById("border").style.border = "1px solid red";
                    document.getElementById("EndingDate").style.border = "none";
                    document.getElementById("JoinDate").style.border = "none";
                    document.getElementById("border2").style = "none";
                    window.scrollTo(0, 300);
                    console.log("Radio Not submitted");
                    return false;  
                }
            }else{
                document.getElementById("EndingDate").style.border = "1px solid red";
                document.getElementById("JoinDate").style.border = "none";
                document.getElementById("border2").style = "none";
                window.scrollTo(0, 500);
                console.log("Not submitted");
                return false;
            }
        }else{
            document.getElementById("JoinDate").style.border = "1px solid red";
            document.getElementById("border2").style = "none";
            window.scrollTo(0, 500);
            console.log("Not submitted");
            return false;
        }
    }else{
        document.getElementById("border2").style.border = "1px solid red";
        window.scrollTo(0, 900);
        console.log("Not submitted");
        return false;
    }
}
