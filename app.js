//jshint esversion:6
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const path = require("path");
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const { runInNewContext } = require("vm");

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

var db = mongoose.connection;

db.once('open', function () {
    console.log('Connected to database');
});

mongoose.set("useCreateIndex",true);


var submitted = false;
var NotSubmitted = false;
var LoggedIn = false;
var ValidationError = false;
var PhoneError = false;
var StudentNumbers = [];



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
    StudentNumber : Number,
    AadharNumber : String,
    Name : String,
    FatherName : String,
    PhoneNumber : Number,
    AlternatePhoneNumber: Number,
    DOB : String,
    Gender : String,
    Locker : String,
    Shift : String,
    ShiftTimingFrom : String,
    ShiftTimingTo : String,
    Reservation : String,
    ReservationSeatNumber : String,
    DOJ : String,
    EndingDate : String,
    Fees : String,
    Advance : String,
    Balance : String,
    PaymentMode : String,
    HouseNo : String,
    Colony : String,
    Landmark : String,
    District : String
});

const Student = mongoose.model("student",studentSchema);
// Schema for User and Student to store in database


//Collection schema for backup
const backupSchema = new mongoose.Schema({
    StudentNumber: Number,
    AadharNumber : String,
    Name : String,
    FatherName : String,
    PhoneNumber : Number,
    AlternatePhoneNumber: Number,
    DOB : String,
    Gender : String,
    Locker : String,
    Shift : String,
    ShiftTimingFrom : String,
    ShiftTimingTo : String,
    Reservation : String,
    ReservationSeatNumber : String,
    DOJ : String,
    EndingDate : String,
    Fees:String,
    Advance : String,
    Balance : String,
    PaymentMode : String,
    HouseNo : String,
    Colony : String,
    Landmark : String,
    District : String
});

const Backup = mongoose.model("Backup",backupSchema);
//Collection schema for backup

//Collection schema for Expenditures
const expendituresSchema = new mongoose.Schema({
    StudentNumber : Number,
    Name : String,
    DOJ : String,
    EndingDate : String,
    Fees : String,
    Advance : String,
    Balance : String,
    PaymentMode : String
});

const Expeditures = mongoose.model("Expenditure",expendituresSchema);
//Collection schema for Expenditures


const ExpenseSchema = new  mongoose.Schema({
    ExpenseDate:String,
    ExpenseName:String,
    ExpensePrice:Number,
    PaymentMode:String
});

const Expense = mongoose.model("Expense",ExpenseSchema);



const NotesSchema = new mongoose.Schema({
    Note:String
});

const Notes = mongoose.model("Note",NotesSchema);







//Person Registration and Root route
User.register({username: process.env.ID_NAME},process.env.PASSWORD,function(err,user){

    User.findOne({username : process.env.ID_NAME},function(error,person){
        if(!error && person){
            console.log("exists");
        }
        else{
            if(err){
                console.log(err);
            }
            passport.authenticate("local", function(_err, user){
                res.redirect("/");
            });
        }
    });
});

app.get("/",function(req,res){
    res.redirect("/login");
});
//Person Registration and Root route













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
//login

















//logout
app.get("/logout",function(req,res){
    LoggedIn = false;
    req.logout();
    res.redirect("/login");
});
//logout




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
//SHowing Students





















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

    if(req.body.PhoneNumber.length != 10)
    {
        PhoneError = true;
        res.redirect("/addStudent");
    }else{

        var numberofStudents;

        Student.find(function(err1, doc1){
            if(err1){
                console.log(err1);
            }
            else{
                Backup.find(function(err2, doc2){
                    if(err2){
                        console.log(err2);
                    }else{

                        for(var i = 0; i < doc1.length;i++){
                            StudentNumbers.push(doc1[i].StudentNumber);
                        }
        
                        for(var j = 0; j < doc2.length;j++){
                            StudentNumbers.push(doc2[j].StudentNumber);
                        }
        
                        StudentNumbers.sort();


                        console.log(StudentNumbers);
        
                        if(StudentNumbers.length > 0){
                            for(var k = 0;k<StudentNumbers.length;k++){
                                if(!StudentNumbers.includes((k+1))){
                                   numberofStudents = k+1; 
                                   console.log(k+1);
                                   console.log("from includes");
                                   break;
                                }
            
                                if(k === StudentNumbers.length - 1){
                                    console.log(k+2);
                                    numberofStudents = k+2; 
                                    console.log("from l-1");
                                }
                            }
                        }else{
                            console.log("1");
                            numberofStudents = 1;
                            console.log("No number here thats why");
                        }

                        const student = new Student({
                            StudentNumber : numberofStudents,
                            AadharNumber : req.body.AadharNumber,
                            Name : req.body.Name,
                            FatherName : req.body.FatherName,
                            PhoneNumber : req.body.PhoneNumber,
                            AlternatePhoneNumber : req.body.AlternatePhoneNumber,
                            DOB : req.body.DOB,
                            Gender : req.body.gender,
                            Locker : req.body.Locker,
                            Shift : req.body.Shift,
                            ShiftTimingFrom : req.body.OtherShiftTimingFrom,
                            ShiftTimingTo : req.body.OtherShiftTimingTo,
                            Reservation : req.body.Reservation,
                            ReservationSeatNumber : req.body.ReservedSeatNumber,
                            DOJ : req.body.DOJ,
                            EndingDate : req.body.EndingDate,
                            Fees: req.body.Fees,
                            Advance : req.body.Advance,
                            Balance : req.body.Balance,
                            PaymentMode : req.body.PaymentMode,
                            HouseNo : req.body.HouseNo,
                            Colony : req.body.Colony,
                            Landmark : req.body.Landmark,
                            District : req.body.District
                        });

                        student.save();

                        const FeeEntry = new Expeditures({
                            StudentNumber : numberofStudents,
                            Name : req.body.Name,
                            DOJ : req.body.DOJ,
                            EndingDate : req.body.EndingDate,
                            Fees : req.body.Fees,
                            Advance : req.body.Advance,
                            Balance : req.body.Balance,
                            PaymentMode : req.body.PaymentMode
                        });

                        FeeEntry.save();
                
                        submitted = true;

                        StudentNumbers = [];
                    
                        res.redirect("/addStudent");
                    }
                });
            }
        });
        }
    }
});                         // var number1;
                                // var number2;
        
                                // if(missingNumbers.length === 0){
                                //     if(doc1.length > 0){
                                //         number1 = doc1[0].StudentNumber;
                                //     }
                                //     else{
                                //         number1 = 0;
                                //     }
                
                                //     if(doc2.length > 0){
                                //         number2 = doc2[0].StudentNumber;
                                //     }else{
                                //         number2 = 0;
                                //     }
                                        
                
                                //     if(number1 > number2){
                                //         numberofStudents = number1 + 1;
                                //     }else{
                                //         numberofStudents = number2 + 1;
                                //     }    
                                // }else{
                                //     numberofStudents = missingNumbers[0].StudentNumber;
                                //     console.log(missingNumbers[0].StudentNumber);

                                //     MissingNumber.deleteOne({'StudentNumber' : missingNumbers[0].StudentNumber},function(err4){
                                //         if(err4){
                                //             console.log(err4);
                                //         }
                                //     });
                                // }
                           









//Deleting Student
app.get("/delete/:id",function(req,res){

if(req.isAuthenticated()){
    var StudentId = req.params.id;

    //Finding Student And Adding to backup Table before delete
    Student.findOne({_id : StudentId},function (err,s){
        if(err){
            console.log(err);
        }else{

            Backup.findOne({'StudentNumber' : s.StudentNumber},function(err1,person){
                if(!err1 && person){
                    console.log("exist");
                    Student.deleteOne({_id:StudentId},function(err3){
                        if(err3){
                            console.log(err3);
                        }
                        else{
                            res.redirect("/studentsList");
                        }
                    }); 
                }else{
                    if(err){
                        console.log(err);
                    }else{
                        
                        const AddtoBackup = new Backup({
                            StudentNumber: s.StudentNumber,
                            AadharNumber : s.AadharNumber,
                            Name : s.Name,
                            FatherName : s.FatherName,
                            PhoneNumber : s.PhoneNumber,
                            AlternatePhoneNumber : s.AlternatePhoneNumber,
                            DOB : s.DOB,
                            Gender : s.gender,
                            Locker : s.Locker,
                            Shift : s.Shift,
                            ShiftTimingFrom : s.ShiftTimingFrom,
                            ShiftTimingTo : s.ShiftTimingTo,
                            Reservation : s.Reservation,
                            ReservationSeatNumber : s.ReservedSeatNumber,
                            DOJ : s.DOJ,
                            EndingDate : s.EndingDate,
                            Fees: s.Fees,
                            Advance : s.Advance,
                            Balance : s.Balance,
                            PaymentMode : s.PaymentMode,
                            HouseNo : s.HouseNo,
                            Colony : s.Colony,
                            Landmark : s.Landmark,
                            District : s.District
                        });

                         AddtoBackup.save();

                         Student.deleteOne({_id:StudentId},function(err){
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
        }
    });
}
else{
    res.redirect("/login");
}
});


app.get("/fulldelete/:id",function(req,res){
    if(req.isAuthenticated()){

        Backup.findOne({_id : req.params.id},function(error,st){
            if(error){
                console.log(error);
            }else{
                Backup.deleteOne({_id:req.params.id},function(err){
                    if(err){
                        console.log(err);
                    }else{
                        res.redirect("/backup");
                        Expeditures.deleteMany({StudentNumber : st.StudentNumber},function(err2){
                            if(err2){
                                console.log(err2);
                            }else{
                                console.log("Deleted");
                            }
                        });
                    }
                });
            }
        });
    }else{
        res.redirect("/login");
    }
});
//Deleting Student





















//Total Price
app.get("/totalPrice",function(req,res){

    if(req.isAuthenticated()){
        Expeditures.find(function(err,students){
            if(err){
                console.log(err);
            }
            else{
                Expense.find(function(err2,ex){
                    if(err2){
                        console.log(err2);
                    }else{
                        var Total = 0;
                        var TotalAdvance = 0;
                        var TotalBalance = 0;
                        var TotalExpense = 0;
            
                        for(let i = 0;i<students.length;i++){
                            
                            if(students[i].Fees){
                            Total = Total + parseInt(students[i].Fees,10);
                            }
        
                            if(students[i].Advance){
                                TotalAdvance = TotalAdvance + parseInt(students[i].Advance,10);
                            }
        
                            if(students[i].Balance){
                                TotalBalance = TotalBalance + parseInt(students[i].Balance,10);
                            }
                        }

                        for(let i=0;i<ex.length;i++){
                            if(ex[i].ExpensePrice){
                                TotalExpense = TotalExpense + parseInt(ex[i].ExpensePrice,10);
                            }

                        }
                        res.render("TotalPrice",{s:students,TotalFees:Total,TotalAdvance : TotalAdvance,TotalBalance : TotalBalance,ex:ex,Totalex:TotalExpense});
                    }
                });
            }
        });
    }
    else{
        res.redirect("/login");
    }
});

app.get("/deletePrice/:id",function(req,res){
    var id = req.params.id;

    Expeditures.deleteOne({_id:id},(err)=>{
        if(err){
            console.log(err);
        }else{
            console.log("deleted price");
            res.redirect("/totalPrice");
        }
    });
});
//Total Price







//Renew Student
app.get("/feesRenew/:id",function(req,res){
    if(req.isAuthenticated()){

        Student.find({_id:req.params.id},function(err,s){

            if(err){
                console.log(err);
            }else{
                res.render("SelectionPage",{id : req.params.id,stu:s});
            }

        });

    }else{
        res.redirect("/login");
    }
});

app.post("/feesRenew",function(req,res){
    if(req.isAuthenticated()){
        Student.findById({_id : req.body.ID},function(err,s){
            if(err){
                console.log(err);
            }else{
                const FeeEntry = new Expeditures({
                    StudentNumber : s.StudentNumber,
                    Name : s.Name,
                    DOJ : req.body.DOJ,
                    EndingDate : req.body.EndingDate,
                    Fees : req.body.Fees,
                    Advance : req.body.Advance,
                    Balance : req.body.Balance,
                    PaymentMode : req.body.PaymentMode
                });

                FeeEntry.save();

                Student.updateOne({_id : req.body.ID},
                    {DOJ : req.body.DOJ,
                    EndingDate : req.body.EndingDate,
                    Fees : req.body.Fees,
                    Advance : req.body.Advance,
                    Balance : req.body.Balance,
                    PaymentMode : req.body.PaymentMode},function(err2){
                        if(err2){
                            console.log(err2);
                        }else{
                            res.redirect("/studentsList");
                        }
                    });
            }
        });
    }else{
        res.redirect("/login");
    }
});
//Renew Student




















//BackUp Control
app.get("/backup",function(req,res){
    if(req.isAuthenticated()){   
        Backup.find(function(err,found){
            res.render("BackUp",{students:found});
        });
    }else{
        res.redirect("/login");
    }
});

app.get("/restore/:id",function(req,res){

    if(req.isAuthenticated()){
        Backup.findOne({_id : req.params.id},function(err,s){
            if(err){
                console.log(err);
            }else{
                Student.findOne({StudentNumber: s.StudentNumber},function(err,item){
                    if(!err && item){
                        console.log("Cant add Already exist");
                        res.redirect("/backup");
                    }
                    else{
                        if(err){
                            console.log(err);
                        }else{
                            const AddtoMainTable = new Student({
                                StudentNumber : s.StudentNumber,
                                AadharNumber : s.AadharNumber,
                                Name : s.Name,
                                FatherName : s.FatherName,
                                PhoneNumber : s.PhoneNumber,
                                AlternatePhoneNumber : s.AlternatePhoneNumber,
                                DOB : s.DOB,
                                Gender : s.gender,
                                Locker : s.Locker,
                                Shift : s.Shift,
                                ShiftTimingFrom : s.ShiftTimingFrom,
                                ShiftTimingTo : s.ShiftTimingTo,
                                Reservation : s.Reservation,
                                ReservationSeatNumber : s.ReservedSeatNumber,
                                DOJ : s.DOJ,
                                EndingDate : s.EndingDate,
                                Fees: s.Fees,
                                Advance : s.Advance,
                                Balance : s.Balance,
                                PaymentMode : s.PaymentMode,
                                HouseNo : s.HouseNo,
                                Colony : s.Colony,
                                Landmark : s.Landmark,
                                District : s.District
                            });
                            AddtoMainTable.save();

                            Backup.deleteOne({_id:req.params.id},function(err){
                                if(err){
                                    console.log(err);
                                }else{
                                    console.log("deleted from backup");
                                }
                            });
            
                            res.redirect("/backup");
                        }
                    }
                });
            }
        });
    }else{
        res.redirect("/login");
    }
});
//BackUp Control























//FullDetails
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
//FullDetails




























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
        if(req.body.PhoneNumber.length != 10)
        {
            PhoneError = true;
            res.redirect("/update/" +StudentId);
        }else
        {
            Student.findById({_id : StudentId},function(err,stu){           //Find Student by ID
                if(err){
                    console.log(err);
                }else{
                    Expeditures.find({StudentNumber : stu.StudentNumber},function(err2,exp){        //Find that Student fee datils in Expediture thorugh StudentNumber
                        if(err2){
                            console.log(err2);
                        }else{
                            Student.findOne({StudentNumber : req.body.StudentNumber},function(e,d){          //Check if there is any student already exist with same serial number
                                if(!e && d && (StudentId != d._id)){
                                    console.log("exist");
                                    NotSubmitted = true;
                                    res.redirect("/update/" +StudentId);
                                }else{ 
                                    Backup.findOne({StudentNumber : req.body.StudentNumber},function(err5,dd){          //Check if there is any student already exist with same serial number
                                        if(!err5 && dd){
                                            console.log("exist in backup");
                                            NotSubmitted = true;
                                            res.redirect("/update/" +StudentId);
                                        }else{
                                            Student.updateOne({_id : StudentId},{                                 // Update basic details of student with s.no. in student collections
                                                StudentNumber : req.body.StudentNumber,
                                                AadharNumber : req.body.AadharNumber,
                                                Name : req.body.Name,
                                                FatherName : req.body.FatherName,
                                                PhoneNumber : req.body.PhoneNumber,
                                                AlternatePhoneNumber : req.body.AlternatePhoneNumber,
                                                DOB : req.body.DOB,
                                                Gender : req.body.gender,
                                                Locker : req.body.Locker,
                                                Shift : req.body.Shift,
                                                ShiftTimingFrom : req.body.OtherShiftTimingFrom,
                                                ShiftTimingTo : req.body.OtherShiftTimingTo,
                                                Reservation : req.body.Reservation,
                                                ReservationSeatNumber : req.body.ReservedSeatNumber,
                                                DOJ : req.body.DOJ,
                                                EndingDate : req.body.EndingDate,
                                                Fees : req.body.Fees,
                                                Advance : req.body.Advance,
                                                Balance : req.body.Balance,
                                                PaymentMode : req.body.PaymentMode,
                                                HouseNo : req.body.HouseNo,
                                                Colony : req.body.Colony,
                                                Landmark : req.body.Landmark,
                                                District : req.body.District
                                            },function(err9){
                                                if(err){
                                                    console.log(err9);
                                                }
                                                else{
                                                    console.log("SNo");
                                                        // After that Set new Student number in expeditures for all fees
                                                        Expeditures.updateMany({StudentNumber : stu.StudentNumber},{StudentNumber : req.body.StudentNumber},function(err3){
                                                            if(err3){
                                                                console.log(err3);
                                                            }else{
                                                                console.log("Changed from Exoeditures Also");
                                                                // find the last fees submitted by student using Ending Date
                                                                var expediturelist = exp;
                                                                var GreaterTime = 0;
                            
                                                                for(var i=0;i<(expediturelist.length);i++){
                                                                    var Date1 = new Date(expediturelist[GreaterTime].EndingDate);
                                                                    var Date2 = new Date(expediturelist[i].EndingDate);
                            
                                                                    if(Date1.getTime() > Date2.getTime()){
                                                                        GreaterTime = GreaterTime;
                                                                    }else{
                                                                        GreaterTime = i;
                                                                    }
                                                                }
                            
                                                                console.log(exp.length);
                                                                //Changing that last fees entry
                                                                if(exp.length != 0){
                                                                    Expeditures.updateOne({_id : expediturelist[GreaterTime]._id},{
                                                                        DOJ : req.body.DOJ,
                                                                        EndingDate : req.body.EndingDate,
                                                                        Fees : req.body.Fees,
                                                                        Advance : req.body.Advance,
                                                                        Balance : req.body.Balance,
                                                                        PaymentMode : req.body.PaymentMode
                                                                    },function(err)
                                                                    {
                                                                        if(err){
                                                                            console.log(err);
                                                                        }else{
                                                                            console.log("Updated");
                                                                            res.redirect("/studentsList");
                                                                        }
                                                                    });
                                                                }else{
                                                                    const newExp = new Expeditures({
                                                                        StudentNumber : req.body.StudentNumber,
                                                                        Name : req.body.Name,
                                                                        DOJ : req.body.DOJ,
                                                                        EndingDate : req.body.EndingDate,
                                                                        Fees : req.body.Fees,
                                                                        Advance : req.body.Advance,
                                                                        Balance : req.body.Balance,
                                                                        PaymentMode : req.body.PaymentMode
                                                                    })

                                                                    newExp.save(function(error2){
                                                                        if(error2){
                                                                            console.log(error2);
                                                                        }else{
                                                                            console.log("added new entry in expenditure");
                                                                            res.redirect("/studentsList");
                                                                        }
                                                                    })
                                                                }
                                                            }
                                                        }); 
                                                 }
                                            });                   
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
            });
        }
    }

});
// UPDATING DETAILS








//EXpense Details and adding expense
app.get("/expense",function(req,res){
    if(req.isAuthenticated()){
        Expense.find(function(err,ex){
            if(err){
                console.log(err);
            }else{
                res.render("Expense",{ex:ex});
            }
        });
        
    }else{
        res.redirect("/login");
    }
});

app.post("/expense",function(req,res){
    if(req.isAuthenticated()){
       const ex = new Expense({
           ExpenseDate : req.body.ExpenseDate,
           ExpenseName : req.body.ExpenseName?req.body.ExpenseName:"Miscellaneous",
           ExpensePrice : req.body.ExpensePrice,
           PaymentMode : req.body.PaymentMode
       }); 

       ex.save(function(err){
           if(!err){
            res.redirect("/expense");
           }
       });
    }else{
        res.redirect("/login");
    }
});

app.get("/deleteExp/:id",function(req,res){
    if(req.isAuthenticated()){
        Expense.deleteOne({_id : req.params.id},function(err){
            if(err){
                console.log(err);
            }else{
                console.log("deleted");
                res.redirect("/expense");
            }
        });
    }else{
        res.redirect("/login");
    }
});
//EXpense Details and adding expense








app.get("/textArea",(req,res)=>{

    if(req.isAuthenticated()){

        Notes.find(function(err,n){
            if(err){
                console.log(err);
            }else{
                if(n[0]){
                    res.render("TextArea",{notes:n[0].Note,notesId:n[0]._id});
                }else{
                    res.render("TextArea",{notes:"",notesId:""});
                }
            }
        });

    }else{
        res.redirect("/login");
    }

    
})

app.post("/textArea",(req,res)=>{

    if(req.isAuthenticated()){
        var n = req.body.Notes;
        var id = req.body.ID;

        Notes.find(function(err,note){
            if(err){
                console.log(err);
            }else{
                if(note[0]){

                    if(id){
                        Notes.updateOne({_id:id},{Note:n},function(err){
                            if(err){
                                console.log(err);
                            }else{
                                res.render("TextArea",{notes:n,notesId:note[0]._id});
                            }
                        });   
                    }
                
                }else{
                    const notes = new Notes({
                        Note:n
                    });

                    console.log("Posted");
                
                    notes.save(function(error){
                        
                        if(error){
                            console.log(error);
                        }else{

                            Notes.find(function(err,no){
                                if(err){
                                    console.log(err);
                                }else{
                                    res.render("TextArea",{notes:no[0].Note,notesId:no[0]._id});
                                }
                            });

                        }
                    }); 
                }
            }
        })
    }else{
        res.redirect("/login");
    }
});










app.listen(process.env.PORT || 3000,function(){
    console.log("Listening to port 3000");
});