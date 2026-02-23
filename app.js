const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const app = express();
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js")
const listings = require("./routes/listing.js")
const reviews = require("./routes/review.js");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
const userRouter = require("./routes/user.js");


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate)
app.use(express.static(path.join(__dirname, "/public")))

const sessionOption = {
    secret: "mysupersecretcode",
    resave: false,
    saveUninitialized : true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 *60 * 1000,
        maxAge: 7 * 24 * 60 *60 * 1000,
        httpOnly: true, //security purpose k liye
        
    }
}
app.use(session(sessionOption));
app.use(flash());

//passport use karne k liye session ki jarurat hoti hai
app.use(passport.initialize());
app.use(passport.session());//why use
//ham chate ki user ek session k andar
//user ek baar hi login kare 
//ya ek hi baar sign up kare
//usse har req per login na karna pade

passport.use(new LocalStrategy(User.authenticate()));
//that is generate a password using local strategy 

passport.serializeUser(User.serializeUser());
//user se realted information ko session k andar 
//store karate hai to usse serialize kahte hai
//login kya user n to baar login nhi karna padega
passport.deserializeUser(User.deserializeUser());
//unstore ya remove karte hai apne session se 
//ek sbhar chala gya to hata dege

const main = async ()=>{
     await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}
main().then(()=>{
    console.log("connected");
}).catch((err)=>{
    console.log(err);
})


app.get("/",(req, res)=>{
    res.send("working...");
})

app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
     res.locals.error = req.flash("error");
     res.locals.currUser = req.user;
    next();
})

app.get("/demouser", async (req, res) =>{
    let fakeUser = new User({
        email: "student@gmail.com",
        username: "delta-student"
    })
   let registeredUser = await User.register(fakeUser, "helloworld");
    //register ek static method passport k andar
    //jike andar user ki info and password pass karte hai
    //iss user ko new password k sath register kardega
    //automatically check hamara user name unique hai ya nhi
    //hai
    res.send(registeredUser);
})

//Listig Route
app.use("/", listings)

//Reviw Route
app.use("/listings/:id/reviews", reviews);

//signup/ login Route
app.use("/", userRouter);



app.use( (req,res, next)=>{
    next(new ExpressError(404, "page not found"))
})

app.use((err,req, res, next)=>{
    let {statusCode= 500, message= "something want wrong"} = err;
    res.status(statusCode).render("Error.ejs", {err});
    //res.status(statusCode).send(message);
})

app.listen("8080", ()=>{
    console.log("port listing on 8080")
})