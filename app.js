//jshint esversion:6
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const path = require("path");
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");

const app = express();

app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname + '/public')));
app.use(session({
   secret : process.env.SECRET,
   resave:false,
   saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

mongoose.connect(process.env.DB_LINK,{useNewUrlParser:true,useUnifiedTopology:true});
mongoose.set("useCreateIndex",true);

var submitted = false;
var NotSubmitted = false;
var LoggedIn = false;
var ValidationError = false;
var PhoneError = false;



// Schema for User and Student to store in database
const UserSchema = new mongoose.Schema({
    username : String,
    password : String
});

UserSchema.plugin(passportLocalMongoose, {
    usernameField : "username"});

const User = new mongoose.model("User",UserSchema);

passport.use(User.createStrategy());
 
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//Creating Students Collection
const studentSchema = new mongoose.Schema({
    AadharNumber : String,
    Name : String,
    FatherName : String,
    PhoneNumber : Number,
    AlternatePhoneNumber: Number,
    DOB : String,
    Gender : String,
    Locker : String,
    Shift : String,
    Reservation : String,
    ReservationSeatNumber : String,
    DOJ : String,
    EndingDate : String,
    Fees:String,
    HouseNo : String,
    Colony : String,
    Landmark : String,
    District : String
});

const Student = mongoose.model("student",studentSchema);
// Schema for User and Student to store in database



User.register({username: process.env.ID_NAME},process.env.PASSWORD,function(err,user){

    User.findOne({username : process.env.ID_NAME},function(error,person){
        if(!error && person){
            console.log("exists");
        }
        else{
            if(err){
                console.log(err);
                return next(err);
            }
            passport.authenticate("local", function(_err, user){
                if(_err) return next(_err);
                res.redirect("/");
                return next();
            });
        }
    });
});



app.get("/",function(req,res){
    res.redirect("/login");
});

//login
app.get("/login",function(req,res){
    res.render("Login",{Error:ValidationError});
    setTimeout(function(){ValidationError = false;},1000);
});

app.post("/login",function(req,res){

    const user = new User({
        username : req.body.username,
        password : req.body.password
    });

    req.login(user,function(err){
        if(err){
            console.log(err);
            ValidationError = true;
            res.redirect("/login");
        }else{
            passport.authenticate("local")(req,res,function(){
                res.redirect("/studentsList");
            });
        }
    });
});


//logout
app.get("/logout",function(req,res){
    LoggedIn = false;
    req.logout();
    res.redirect("/login");
});





//SHowing Students
app.get("/studentsList",function(req,res){

    if(req.isAuthenticated()){
        Student.find({},function(err,foundItems){
            res.render("StudentsDetails",{students : foundItems});
        }); 
    }else{
        res.redirect("/login");
    }

});








//Adding Student
app.get("/addStudent",function(req,res){

    if(req.isAuthenticated()){
        res.render("AddNewStudent",{Added:submitted,NotAdded:NotSubmitted,Phone:PhoneError});

        setTimeout(function(){submitted = false; NotSubmitted=false; PhoneError = false;},1000);
    }else{
        res.redirect("/login");
    }

});



app.post("/addStudent",function(req,res){

if(req.body.Name == "" || req.body.FatherName == ""){
    NotSubmitted = true;
    res.redirect("/addStudent");
}
else{

    if(req.body.PhoneNumber.length != 10 || req.body.AlternatePhoneNumber.length != 10)
    {
        PhoneError = true;
        res.redirect("/addStudent");
    }else{
        const student = new Student({
            AadharNumber : req.body.AadharNumber,
            Name : req.body.Name,
            FatherName : req.body.FatherName,
            PhoneNumber : req.body.PhoneNumber,
            AlternatePhoneNumber : req.body.AlternatePhoneNumber,
            DOB : req.body.DOB,
            Gender : req.body.gender,
            Locker : req.body.Locker,
            Shift : req.body.Shift,
            Reservation : req.body.Reservation,
            ReservationSeatNumber : req.body.ReservedSeatNumber,
            DOJ : req.body.DOJ,
            EndingDate : req.body.EndingDate,
            Fees: req.body.Fees,
            HouseNo : req.body.HouseNo,
            Colony : req.body.Colony,
            Landmark : req.body.Landmark,
            District : req.body.District
        });
    
        student.save();
        submitted = true;
    
        res.redirect("/addStudent");
    }

}
});






//Deleting Student
app.get("/delete/:id",function(req,res){

if(req.isAuthenticated()){
    var StudentId = req.params.id;

    Student.deleteOne({_id:StudentId},function(err){
        if(err){
            console.log(err);
        }
        else{
            res.redirect("/studentsList");
        }
    }); 
}
else{
    res.redirect("/login");
}

});



//FullDetailsw
app.get("/fullDetails/:id",function(req,res){
    if(req.isAuthenticated()){
        var StudentId = req.params.id;

        Student.findById({_id:StudentId},function(err,Item){
            res.render("FullDetails",{student : Item});
        });
    }else{
        res.redirect("/login");
    }

});





// UPDATING DETAILS
app.get("/update/:id",function(req,res){
if(req.isAuthenticated()){
    var StudentId = req.params.id;

    Student.findById({_id:StudentId},function(err,foundItem){
        if(err){
            console.log(err);
        }
        else{
            res.render("UpdateStudent",{student:foundItem,NotAdded:NotSubmitted,Phone:PhoneError});

            setTimeout(function(){submitted = false; NotSubmitted=false; PhoneError = false;},1000);
        }
    });
}else{
    res.redirect("/login");
}
});

app.post("/update/:id",function(req,res){
    var StudentId = req.params.id;

    if(req.body.Name == "" || req.body.FatherName == ""){
        NotSubmitted = true;
        res.redirect("/update/" +StudentId);
    }
    else{
        if(req.body.PhoneNumber.length != 10 || req.body.AlternatePhoneNumber.length != 10)
        {
            PhoneError = true;
            res.redirect("/update/" +StudentId);
        }else
        {
            Student.updateOne({_id:StudentId},{     
                AadharNumber : req.body.AadharNumber,
                Name : req.body.Name,
                FatherName : req.body.FatherName,
                PhoneNumber : req.body.PhoneNumber,
                AlternatePhoneNumber : req.body.AlternatePhoneNumber,
                DOB : req.body.DOB,
                Gender : req.body.gender,
                Locker : req.body.Locker,
                Shift : req.body.Shift,
                Reservation : req.body.Reservation,
                ReservationSeatNumber : req.body.ReservedSeatNumber,
                DOJ : req.body.DOJ,
                EndingDate : req.body.EndingDate,
                Fees : req.body.Fees,
                HouseNo : req.body.HouseNo,
                Colony : req.body.Colony,
                Landmark : req.body.Landmark,
                District : req.body.District
            },function(err){
                if(err){
                    console.log(err);
                }
                else{
                    res.redirect("/studentsList");
                }
            });
        }
    }

});







app.listen(process.env.PORT || 3000,function(){
    console.log("Listening to port 3000");
});