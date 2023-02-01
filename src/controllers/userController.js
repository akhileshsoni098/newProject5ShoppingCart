const express = require("express");
const userModel = require("../models/userModel");
const jwt = require("jsonwebtoken");
const aws = require("aws-sdk");
const validation = require("../validations/validation");

aws.config.update({
  accessKeyId: "AKIAY3L35MCRZNIRGT6N",
  secretAccessKey: "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",
  region: "ap-south-1",
});

let uploadFile = async (file) => {
  return new Promise(function (resolve, reject) {
    let s3 = new aws.S3({ apiVersion: "2006-03-01" });

    var uploadParams = {
      ACL: "public-read", //Access Control Locator
      Bucket: "classroom-training-bucket",
      Key: "abc/" + file.originalname,
      Body: file.buffer,
    };

    s3.upload(uploadParams, function (err, data) {
      if (err) {
        return reject({ error: err });
      }
      //   console.log(data);
      console.log("file uploaded succesfully");
      return resolve(data.Location);
    });
  });
};

const register = async (req, res) => { // there are 3 problems have to resolve ==> 1. address , fname validation , bycrpt 
  try {
    let userData = req.body;

    let { fname, lname, email, profileImage, phone, password, address } =
      userData;

if(Object.keys(userData).length==0){return res.status(400).send({status:false , message:"please provide required fields"})}

      //============ fname====================

      if(!fname){return res.status(400).send({status:false , message:"fname is mandatory"})}
      if(typeof(fname)!= "string"){return res.status(400).send({status:false , message:"fname should be in string"})}
      // regex 
      fname = userData.fname = fname.trim()

      if (fname == "") return res.status(400).send({ status: false, message: "Please enter password" });
    
      if(!validation.validateName(fname)){return res.status(400).send({status:false , message:"please provide valid first name "})}
      
      // ========================= lname ==================
      
      if(!lname){return res.status(400).send({status:false , message:"lname is mandatory"})}
      if(typeof(lname)!= "string"){return res.status(400).send({status:false , message:"last name should be in string"})}
      // regex 
      lname = userData.lname = lname.trim()
      if (lname == "") return res.status(400).send({ status: false, message: "Please enter lname" });
      if(!validation.validateName(lname)){return res.status(400).send({status:false , message:"please provide valid last  name "})}

      //================================ email ======
      
      if(!email){return res.status(400).send({status:false , message:"email is mandatory"})}
      if(typeof(email)!= "string"){return res.status(400).send({status:false , message:"email id  should be in string"})}
      
      //=========== regex ======= 
      email = userData.email = email.trim()
      if (email == "") return res.status(400).send({ status: false, message: "Please enter email" });
      if(!validation.validateEmail(email)){return res.status(400).send({status:false , message:"please provide valid email id"})}

      const emailExist = await userModel.findOne({email:email})
      if(emailExist){res.status(400).send({status:false , message:"email id  already exist"})}
      
      
      //======= phone =============
      

      if(!phone){return res.status(400).send({status:false , message:"phone is mandatory"})}
      if(typeof(phone)!= "string"){return res.status(400).send({status:false , message:"phone should be in string"})}
      
      // regex

      if (phone == "") return res.status(400).send({ status: false, message: "Please enter email" });
      if(!validation.validateEmail(phone)){return res.status(400).send({status:false , message:"please provide valid email id"})}
     
      
      
      if(phoneExist){res.status(400).send({status:false , message:"phone is already exist"})}
 
      //========= password ======

      if(!password){return res.status(400).send({status:false , message:"password is mandatory"})}
      if(typeof(password)!= "string"){return res.status(400).send({status:false , message:"please provide password in string "})}

   //regex

     if(!validation.validatePassword(password)){return res.status(400).send({status:false , message:"please provide valid password"})}



// bycrypt part password in 



//======================== address =============

//  there is two condition to take address 1 make it mandatory or optional like if(address){} then ....

//========= checking both condition ======

if(!address){return res.status(400).send({status:false , message:"address is mandatory "})}
// if(address){

//======== address  shipping ============

// if(address.shipping){  // checking.....

if(!address.shipping){return res.status(400).send({status:false , message:"shipping  is mandatory "})}

if(!address.shipping.street){return res.status(400).send({status:false , message:"shipping street  is mandatory "})}
if(typeof(address.shipping.street)!="string"){return res.status(400).send({status:false , message:"shipping street  will be in string "})}

//=== city

if(!address.shipping.city){return res.status(400).send({status:false , message:"shipping city  is mandatory "})}
if(typeof(address.shipping.city)!="string"){return res.status(400).send({status:false , message:"shipping city  will be in string "})}


//====pincode

if(!address.shipping.pincode){return res.status(400).send({status:false , message:"shipping pincode  is mandatory "})}
if(typeof(address.shipping.pincode)!="number"){return res.status(400).send({status:false , message:"shipping pincode  will be in number "})}

// }

//====== address billing ====

// if(address.billing){  // checking .....
// if(!address.billing){return res.status(400).send({status:false , message:"billing  is mandatory "})}

if(!address.billing.street){return res.status(400).send({status:false , message:"billing street  is mandatory "})}
if(typeof(address.shipping.street)!="string"){return res.status(400).send({status:false , message:"billing street  will be in string "})}

//=== city
if(!address.billing.city){return res.status(400).send({status:false , message:"billing city  is mandatory "})}
if(typeof(address.shipping.city)!="string"){return res.status(400).send({status:false , message:"billing city  will be in string "})}

//====pincode

if(!address.billing.pincode){return res.status(400).send({status:false , message:"billing pincode  is mandatory "})}
if(typeof(address.shipping.pincode)!="number"){return res.status(400).send({status:false , message:"billing pincode  will be in number "})}
// }
    userData.address = JSON.parse(address);
    console.log(userData.address);
// }
 

    //AWS

    profileImage = req.files;

    if (Object.keys(profileImage).length == 0) {
      return res
        .status(400)
        .send({ status: false, message: "Please upload Profile Image" });
    }

    let image = await uploadFile(profileImage[0]);

    userData.profileImage = image;

    const usercreated = await userModel.create(userData);
    return res.status(201).send({ status: true, data: usercreated });
  } catch (error) {
    console.log(error.message);
    return res.status(500).send({ status: false, message: error.message });
  }
};




const loginUser = async (req, res) => {
  let data = req.body;
let {email , password} = data
  if (Object.keys(data) == 0)
    return res.status(400).send({ status: false, message: "Please send data" });

//=====email ========================

if(!email){return res.status(400).send({status:false , message:"email is mandatory"})}
if(typeof(email)!= "string"){return res.status(400).send({status:false , message:"email id  should be in string"})}
email =
//=========== regex ======= 

if(!validation.validateEmail(email)){return res.status(400).send({status:false , message:"please provide valid email id"})}

//========password  =====


if(!password){return res.status(400).send({status:false , message:"password is mandatory"})}
if(typeof(password)!= "string"){return res.status(400).send({status:false , message:"please provide password in string "})}

//regex

if(!validation.validatePassword(password)){return res.status(400).send({status:false , message:"please provide valid password"})}

// ==== password bycrpt encrpt part

  let isUserExist = await userModel.findOne({
    email: email,
    password: password,
  });
  if (!isUserExist)
    return res.status(404).send({ status: false, message: "No user found " });


  let token = jwt.sign(
    { userId: isUserExist.userId, exp: Date.now() / 1000 + 86400 },
    "project5"
  );

  let obj = {}
  res
    .status(200)
    .send({ status: true, message: "User login successfull", data: token });
};

module.exports = { loginUser, register };
