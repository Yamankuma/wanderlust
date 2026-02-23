const express =require("express");
const app = express();
const session = require("express-session");
const flash = require("connect-flash");
const path = require("path")
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

const  sessionOption = {
    secret: "mysupersecretstring",
    resave: false,
    saveUninitialized: true,
}

app.use(session(sessionOption));
app.use(flash());

app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
})

app.get("/register", (req, res)=>{
    let {name = "anonyumous"} =req.query;
    req.session.name = name;
   
    if(name === "anonyumous"){
    req.flash("error", "user not register");
    }else{
        req.flash("success", "user register successfully!");
    }
    res.redirect("/hello");
})

app.get("/hello", (req,res)=>{
    
    res.render("page.ejs", {name: req.session.name})
})//name ko  direct access kar sakte hai
//after referece not show message

//   app.get("/reqcount", (req, res)=>{
//     if(req.session.count){
//         req.session.count++;
//     }else{
//         req.session.count =1;
//     }
   
//      res.send(`you sent a request ${req.session.count} time`);
//   })//req.session ek single session ko track karta hai

// app.get("/test", (req, res)=>{
//     res.send("test succesfull")
// })


app.listen(3000,()=>{
    console.log("server run....")
})