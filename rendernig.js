// env
if(process.env.NODE_ENV!="Production"){
require('dotenv').config();
}
// console.log(process.env); 
// env
const mongoose = require("mongoose");
const express = require("express");
// const validedata = require("validedata");
 const validedata = require("./Error/vailidData.js");
// const Insert = require("./insertData");
// const mongoose = require("mongoose");
// const multer=  require("multer");
const app = express();
const path = require("path");
// const Data = require("./database/data.js");
const ExpressError = require("./Error/ExpressError.js");
// const Data = require("./insertData");
// const asyncError = require("./Error/asyncError");
// const session = require("express-session");
// const MongoStore = require("connect-mongo");
// const MongoStore = require("connect-mongo")(session);

//cookies
const flash = require("connect-flash");
app.use(express.static('public'));

//cookies
const methodOverride = require('method-override');
const userInfo = require("./routes/users.js"); 
//password
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./database/Paswd.js");
const signUp = require("./routes/signLogin.js");
const dbUrl=process.env.ATLASDB_URL;

//password
app.use(methodOverride('_method'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname,"views")));
app.use(flash());

const session = require("express-session");
const MongoStore = require("connect-mongo")(session);

// Make sure mongoose is connected before this line
// mongoose.connect(dbUrl) ...

app.use(session({
  secret: process.env.SECRET_API || "fallback-secret-change-this-immediately",
  resave: false,
  saveUninitialized: false,
  store: new MongoStore({
    mongooseConnection: mongoose.connection,   // ← best for v3
    collection: "sessions",
    ttl: 7 * 24 * 60 * 60,
    autoRemove: "native",
    touchAfter: 24 * 3600,
    crypto: {
      secret: process.env.SECRET_API
    }
  }),
  cookie: {
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production"
  }
}));
// password
app.use(passport.initialize());
app.use(passport.session());
// app.use(new LocalStrategy(User.authorization()));
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
// password

main().then((res)=>{console.log("database is working")})
.catch((err)=>{console.log(err)});


async function main() {
   await mongoose.connect(dbUrl);
}
//flash
app.use((req,res,next)=>{
   res.locals.successMSG = req.flash("success");
   res.locals.Delete = req.flash("Delete");
   res.locals.Update = req.flash("Update");
   res.locals.error = req.flash("error");
   res.locals.logops = req.user;
   res.locals.currentUser = req.user;   // ← ab har ejs mein currentUser mil jayega
   next();
});

// password

// password

app.use("/api",userInfo);
app.use("/api",signUp);
// Data.insertMany({
//    name:"amit",
//    deg:"AXC",
//    age:23
// })
// .then(() => console.log("Data inserted"))
//  .catch(err => console.error(err));

// path exist nhi ho tab
app.use((req, res, next) => {
next(new ExpressError(404, "Page not found"));
});

// ERR
app.use((err,req,res,next)=>{
let {status=500, message="data not found"} = err;
res.status(status).send(message);
});
app.listen(2000,()=>{
   console.log("express is working");
});

