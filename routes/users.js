const express = require("express");
// cloudery
// const cloudinary = require('cloudinary').v2
// cloudinary
// const Insert = require("./insertData");
// const mongoose = require("mongoose");
const app = express();
const validedata = require("../Error/vailidData.js");
const path = require("path");
const Data = require("../database/data.js");
const ExpressError = require("../Error/ExpressError.js");
const athetication = require("../passwordAth/athetication.js")


const asyncError = require("../Error/asyncError");
const methodOverride = require('method-override');
const { authenticate } = require("passport");
const router = express.Router();
const Listing = require("../controller/listing.js");
// cloudinary
// const {storage} = require("../cloudConfig.js");
//
// upload
const multer  = require('multer');
const { storage } = require("../cloudConfig.js");

const upload = multer({ storage: storage });
// 
app.use(methodOverride('_method'));
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname,"views")));
// showListing..come from ..listing.js
router.get("/",(Listing.porti));
router.get("/about",(Listing.about));


router.get("/home",asyncError(Listing.showListing));
// delete route
router.delete("/delete/:id", athetication, asyncError(Listing.delete));

router.get("/new",athetication,(Listing.newData));
// router.post("/newdata",athetication,validedata,asyncError(async(req,res)=>{
//    let {name,deg,age,img} = req.body;
//    const alldata = await Data({name,deg,age,img});
//    await alldata.save();
//    req.flash("success", "Post successfully");
//    res.redirect("/api/home");
// }));



// postnewdata
router.post("/newdata", athetication,upload.single("img"),validedata,asyncError(Listing.postNewdata));

// updatedata
// router.get("/update/:id",athetication,validedata,asyncError(Listing.updateData ));
//update
// router.patch("/update/:id",athetication,validedata,asyncError(Listing.patchdata));
// binding same route path

router.route("/update/:id")
.get(athetication,asyncError(Listing.updateData ))
.patch(athetication, upload.single("img"),validedata,asyncError(Listing.patchdata));


module.exports = router;