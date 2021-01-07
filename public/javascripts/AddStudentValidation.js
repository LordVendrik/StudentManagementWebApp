function isInputNumber(evt){
    var char = String.fromCharCode(evt.which);

    if(!(/[0-9]/.test(char))){
        evt.preventDefault();
    }
}


$('input[type=radio][name=Reservation]').change(function() {
    if (this.value == 'Yes') {
        document.getElementById("ReservedSeatNumber").classList.remove("FilterEndSession");
    }
    else if (this.value == 'No') {
        document.getElementById("ReservedSeatNumber").classList.add("FilterEndSession");
        document.getElementById("ReservedSeatNumber").value = "";
    }
});