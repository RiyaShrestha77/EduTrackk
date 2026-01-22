const express = require("express").Router();
const multer = require("multer");
const upload = multer ();
const {loginUser}= require('../controllers/usercontrollers');


express.post("/login", loginUser);
express.post("/register",upload.none(),addUser)
module.exports=express;