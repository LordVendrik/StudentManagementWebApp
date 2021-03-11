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
    var Endday = new Date(document.getElementById("JoinDate").value);

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

function validateMyForm(){
    console.log("Not Submitted");
    var Name = document.getElementById("Name").value;
    var FatherName = document.getElementById("FatherName").value;
    var PhoneNumber = document.getElementById("PhoneNumber").value;
    var DOJ = document.getElementById("JoinDate").value;
    var EndingDate = document.getElementById("EndingDate").value;
    var Fees = document.getElementById("Fees").value;

    if(Name){
        if(FatherName){
            if(PhoneNumber){
                if(DOJ){
                    if(EndingDate){
                        if(Fees){
                            return true;
                        }else{
                            document.getElementById("Fees").style.border = "1px solid red";
                            document.getElementById("EndingDate").style.border = "none";
                            document.getElementById("JoinDate").style.border = "none";
                            document.getElementById("PhoneNumber").style.border = "none";
                            document.getElementById("FatherName").style.border = "none";
                            document.getElementById("Name").style.border = "none";
                            console.log(Name);
                            window.scroll(0,700);
                            return false;
                        }
                    }else{
                        document.getElementById("EndingDate").style.border = "1px solid red";
                        document.getElementById("JoinDate").style.border = "none";
                        document.getElementById("PhoneNumber").style.border = "none";
                        document.getElementById("FatherName").style.border = "none";
                        document.getElementById("Name").style.border = "none";
                        console.log(Name);
                        window.scroll(0,700);
                        return false;
                    }
                }else{
                    document.getElementById("JoinDate").style.border = "1px solid red";
                    document.getElementById("PhoneNumber").style.border = "none";
                    document.getElementById("FatherName").style.border = "none";
                    document.getElementById("Name").style.border = "none";
                    console.log(Name);
                    window.scroll(0,700);
                    return false;
                }
            }else{
                document.getElementById("PhoneNumber").style.border = "1px solid red";
                document.getElementById("FatherName").style.border = "none";
                document.getElementById("Name").style.border = "none";
                console.log(Name);
                window.scroll(0,0);
                return false;
            }
        }else{
            document.getElementById("FatherName").style.border = "1px solid red";
            document.getElementById("Name").style.border = "none";
            console.log(Name);
            window.scroll(0,0);
            return false;
        }
    }else{
        document.getElementById("Name").style.border = "1px solid red";
        console.log(Name);
        window.scroll(0,0);
        return false;
    }
    
}