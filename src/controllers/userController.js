const express = require("express");
const mongoose = require('mongoose')
const userModel = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt')
const validation = require("../validations/validation");

const register = async (req, res) => {
  // there are 3 problems have to resolve ==> 1. address , fname validation , bycrpt
  try {
    let userData = req.body;

    let { fname, lname, email, profileImage, phone, password, address } =
      userData;

    if (Object.keys(userData).length == 0) {
      return res
        .status(400)
        .send({ status: false, message: "please provide required fields" });
    }

    //============ fname====================

    if (!fname) {
      return res
        .status(400)
        .send({ status: false, message: "first name is mandatory" });
    }
    if (typeof fname != "string") {
      return res
        .status(400)
        .send({ status: false, message: "first name should be in string" });
    }
    // regex
    fname = userData.fname = fname.trim();

    if (fname == "")
      return res
        .status(400)
        .send({ status: false, message: "Please Enter first name value" });

    if (!validation.validateName(fname)) {
      return res
        .status(400)
        .send({ status: false, message: "please provide valid first name " });
    }

    // ========================= lname ==================

    if (!lname) {
      return res
        .status(400)
        .send({ status: false, message: "last name is mandatory" });
    }
    if (typeof lname != "string") {
      return res
        .status(400)
        .send({ status: false, message: "last name should be in string" });
    }
    // regex
    lname = userData.lname = lname.trim();
    if (lname == "")
      return res
        .status(400)
        .send({ status: false, message: "Please enter last name value" });
    if (!validation.validateName(lname)) {
      return res
        .status(400)
        .send({ status: false, message: "please provide valid last  name " });
    }

    //================================ email ======

    if (!email) {
      return res
        .status(400)
        .send({ status: false, message: "email is mandatory" });
    }
    if (typeof email != "string") {
      return res
        .status(400)
        .send({ status: false, message: "email id  should be in string" });
    }

    //=========== email =======

    email = userData.email = email.trim();
    if (email == "")
      return res
        .status(400)
        .send({ status: false, message: "Please enter email" });
    if (!validation.validateEmail(email)) {
      return res
        .status(400)
        .send({ status: false, message: "please provide valid email id" });
    }

    //======= phone =============

    if (!phone) {
      return res
        .status(400)
        .send({ status: false, message: "phone is mandatory" });
    }
    if (typeof phone != "string") {
      return res
        .status(400)
        .send({ status: false, message: "phone should be in string" });
    }

    phone = userData.phone = phone.trim();

    if (phone == "")
      return res
        .status(400)
        .send({ status: false, message: "Please enter phone" });

    if (!validation.validateMobileNo(phone)) {
      return res.status(400).send({
        status: false,
        message: "please provide valid 10 digit Phone Number",
      });
    }

    const userExist = await userModel.findOne({
      $or: [{ email: email }, { phone: phone }],
    });

    if (userExist) {
      if (userExist.email == email) {
        return res
          .status(400)
          .send({ status: false, message: "email id  already exist" });
      }

      if (userExist.phone == phone) {
        return res
          .status(400)
          .send({ status: false, message: "phone  already exist" });
      }
    }

    //========= password ======

    if (!password) {
      return res
        .status(400)
        .send({ status: false, message: "password is mandatory" });
    }

    if (typeof password != "string") {
      return res
        .status(400)
        .send({ status: false, message: "please provide password in string " });
    }
    password = userData.password = password.trim();

    if (password == "") {
      return res
        .status(400)
        .send({ status: false, message: "Please provide password value" });
    }


    //regex password

    if (!validation.validatePassword(password)) {
      return res.status(400).send({
        status: false,
        message:
          "please provide valid Alphanumeric 8-15 length Atleast One Special character password",
      });
    }

    //Encrypting password

    let hashing = bcrypt.hashSync(password, 10);
    userData.password = hashing;

    //======================== address =============

    address = userData.address = JSON.parse(address);

    if (!address) {
      return res
        .status(400)
        .send({ status: false, message: "Address is mandatory " });
    }

    if (typeof address != "object")
      return res.status(400).send({
        status: false,
        message: "Address should be in Object format ",
      });

    // ======== address  shipping ============

    if (!address.shipping) {
      return res
        .status(400)
        .send({ status: false, message: "Shipping Address is mandatory " });
    }

    if (typeof address.shipping != "object")
      return res.status(400).send({
        status: false,
        message: "Address of shipping should be in Object format ",
      });

    // =========street validation=========
    if (!address.shipping.street) {
      return res
        .status(400)
        .send({ status: false, message: "Shipping street is mandatory " });
    }

    if (typeof address.shipping.street != "string") {
      return res.status(400).send({
        status: false,
        message: "shipping street  will be in string ",
      });
    }

    address.shipping.street = userData.address.shipping.street = address.shipping.street.trim()

    if (address.shipping.street == "") {
      return res.status(400).send({
        status: false,
        message: "Please provide shipping street value",
      });
    }

    //========= city validation =========================

    if (!address.shipping.city) {
      return res
        .status(400)
        .send({ status: false, message: "shipping city is mandatory " });
    }
    if (typeof address.shipping.city != "string") {
      return res.status(400).send({
        status: false,
        message: "shipping city will be in string ",
      });
    }

    address.shipping.city = userData.address.shipping.city = address.shipping.city.trim();

    if (address.shipping.city == "") {
      return res.status(400).send({
        status: false,
        message: "Please provide shipping city value",
      })
    }

    //====pincode

    if (!address.shipping.pincode) {
      return res.status(400).send({
        status: false,
        message: "shipping pincode is mandatory ",
      });
    }

    // address.shipping.pincode = userData.address.shipping.pincode =  address.shipping.pincode.trim(); 
    if (!validation.validatePincode(address.shipping.pincode)) { return res.status(400).send({ status: false, message: "please provide valid shipping pincode" }) }

    if (typeof address.shipping.pincode != "number") {
      return res.status(400).send({
        status: false,
        message: "shipping pincode  will be in number ",
      });
    }

    if (address.shipping.pincode == "") {
      return res.status(400).send({
        status: false,
        message: "Please provide shipping pincode value",
      })
    }

    //====== address billing ====
    if (!address.billing) {
      return res
        .status(400)
        .send({ status: false, message: "billing Address is mandatory " });
    }

    if (typeof address.billing != "object")
      return res.status(400).send({
        status: false,
        message: "Address of billing should be in Object format ",
      });


    if (!address.billing.street) {
      return res
        .status(400)
        .send({ status: false, message: "billing street is mandatory " });
    }

    if (typeof address.billing.street != "string") {
      return res.status(400).send({
        status: false,
        message: "billing street  will be in string ",
      });
    }
    address.billing.street = address.billing.street.trim();

    if (address.billing.street == "") {
      return res.status(400).send({
        status: false,
        message: "Please provide billing street value",
      })
    }

    //=== city
    if (!address.billing.city) {
      return res
        .status(400)
        .send({ status: false, message: "billing city  is mandatory " });
    }

    if (typeof address.shipping.city != "string") {
      return res.status(400).send({
        status: false,
        message: "billing city  will be in string ",
      });
    }

    address.billing.city = address.billing.city.trim();

    if (address.billing.city == "") {
      return res.status(400).send({
        status: false,
        message: "Please provide billing city value",
      })
    }

    //====pincode============

    if (!address.billing.pincode) {
      return res
        .status(400)
        .send({ status: false, message: "billing pincode  is mandatory " });
    }


    if (typeof address.shipping.pincode != "number") {
      return res.status(400).send({
        status: false,
        message: "billing pincode  will be in number ",
      });
    }

    if (address.billing.pincode == "") {
      return res.status(400).send({
        status: false,
        message: "Please provide billing pincode value",
      })
    }

    if (!validation.validatePincode(address.shipping.pincode)) { return res.status(400).send({ status: false, message: "please provide valid shipping pincode" }) }

    //AWS

    userData.profileImage = req.image;

    const usercreated = await userModel.create(userData);

    return res.status(201).send({ status: true, data: usercreated });
  } catch (error) {
    console.log(error.message);
    return res.status(500).send({ status: false, message: error.message });
  }
};

const loginUser = async (req, res) => {
  try {
    let data = req.body;
    if (Object.keys(data) == 0)
      return res
        .status(400)
        .send({ status: false, message: "Please send data" });
    let { email, password } = data;

    if (!email)
      return res
        .status(400)
        .send({ status: false, message: "Please enter Emaill" });

    data.email = email.trim();

    if (email != undefined && typeof email != "string")

      return res
        .status(400)
        .send({ status: false, message: "Please enter Emaill in string format" });

    if (email == "")
      return res
        .status(400)
        .send({ status: false, message: "Please enter Email" });

    if (!validation.validateEmail(email))
      return res
        .status(400)
        .send({ status: false, message: "Please enter valid Email" });

    if (!password)
      return res
        .status(400)
        .send({ status: false, message: "Please enter password" });

    if (password != undefined && typeof password != "string")
      return res
        .status(400)
        .send({ status: false, message: "Please enter password in string format" });

    data.password = password.trim();

    if (password == "")
      return res
        .status(400)
        .send({ status: false, message: "Please enter password" });

    if (!validation.validatePassword(password))
      return res
        .status(400)
        .send({ status: false, message: "Please enter valid password" });

    //       

    let isUserExist = await userModel.findOne({
      email: email
    });

    if (!isUserExist)
      return res.status(404).send({
        status: false,
        message: "No user found with given credentials ",
      });

    let passwordCompare = await bcrypt.compare(password, isUserExist.password);
    if (!passwordCompare) return res.status(400).send({ status: false, message: "Please enter valid password" })

    let token = jwt.sign(
      { userId: isUserExist._id, exp: Math.floor(Date.now() / 1000) + 12000000 },
      "project5"
    );

    let tokenInfo = { userId: isUserExist._id, token: token };

    res.status(200).send({
      status: true,
      message: "User login successfully",
      data: tokenInfo,
    });
  } catch (err) {
    return res.status(500).send({ status: false, error: err.message });
  }
};

const getUser = async function (req, res) {
  try {
    let userId = req.params.userId

    if (!mongoose.isValidObjectId(userId))
      return res.status(400).send({ status: false, message: "Please provide valid userId" })

    let data = await userModel.findById(userId)

    if (!data) { return res.status(404).send({ status: false, message: "User is not found" }) }

    return res.status(200).send({ status: true, message: "User profile details", data: data })
  }
  catch (err) {
    return res.status(500).send({ status: false, error: err.message });
  }
}

const UpdateUser = async function (req, res) {

  try {

    const userId = req.params.userId
    let userData = req.body
    let { fname, lname, email, phone, password, address } = userData

    let profileImage = req.files;

    if (profileImage) userData.length += 1


    if (Object.keys(userData).length == 0) {
      return res.status(400).send({ status: false, message: "Please provide some data to update user" })
    }

    //=============================================== fname

    if (fname) {
      if (typeof fname != "string") {
        return res
          .status(400)
          .send({ status: false, message: "first name should be in string" });
      }
      // regex
      fname = userData.fname = fname.trim();

      if (fname == "")
        return res
          .status(400)
          .send({ status: false, message: "Please Enter first name value" });

      if (!validation.validateName(fname)) {
        return res
          .status(400)
          .send({ status: false, message: "please provide valid first name " });
      }
    }

    if (lname) {
      if (typeof lname != "string") {
        return res
          .status(400)
          .send({ status: false, message: "last name should be in string" });
      }
      // regex
      lname = userData.lname = lname.trim();
      if (lname == "")
        return res
          .status(400)
          .send({ status: false, message: "Please enter last name value" });
      if (!validation.validateName(lname)) {
        return res
          .status(400)
          .send({ status: false, message: "please provide valid last  name " });
      }
    }
    // ================================ email 
    let userExist;
    if (email) {

      if (typeof (email) != "string")
        return res.status(400).send({ status: false, message: "Please provide email in string" })
      if (email == "") return res.status(400).send({ status: false, message: "Please provide value of email" })

      email = userData.email = email.trim()

     let userExist = await userModel.findOne({ $or: [{ email: email}, {phone: phone }] })

      console.log(userExist);
      if (userExist) {
        if (userExist.email == email) // check 
          return res.status(400).send({ status: false, message: "email is  already exists" })
      }
    }


    //============================== phone
    if (phone) {

      if (typeof (phone) != "string")
        return res.status(400).send({ status: false, message: "Please provide phone in number" })
      if (phone == "") return res.status(400).send({ status: false, message: "Please provide value of phone" })

      phone = userData.phone = phone.trim()
      
      if (userExist) {
        if (userExist.phone == phone) // check 
        return res.status(400).send({ status: false, message: "phone is  already exists" })
      }
    }

    //============================  password

    if (password) {

      if (typeof (password) != "string")
        return res.status(400).send({ status: false, message: "Please provide password in string" })
      password = userData.password = password.trim()
      if (password == "") return res.status(400).send({ status: false, message: "Please provide value of password" })

      let hashing = bcrypt.hashSync(password, 10);
      userData.password = hashing;
    }
    // ========================== address
    if (address) {
      address = userData.address = JSON.parse(address);

      if (typeof address != "object")
        return res.status(400).send({
          status: false,
          message: "Address should be in Object format ",
        });
      if (address == "") return res.status(400).send({ status: false, message: "Please provide value of address" })

      // =======address.shiping
      if (address.shipping) {

        if (typeof address.shipping != "object")
          return res.status(400).send({
            status: false,
            message: "Address of shipping should be in Object format ",
          });

        if (address.shipping.street) {

          if (typeof address.shipping.street != "string") {
            return res.status(400).send({
              status: false,
              message: "shipping street  will be in string ",
            });
          }
        }

        address.shipping.street = userData.address.shipping.street = address.shipping.street.trim()

        if (address.shipping.street == "") {
          return res.status(400).send({
            status: false,
            message: "Please provide shipping street value",
          });
        }

        //========= city  =========================

        if (address.shipping.city) {

          if (typeof address.shipping.city != "string") {
            return res.status(400).send({
              status: false,
              message: "shipping city will be in string ",
            });
          }

          address.shipping.city = userData.address.shipping.city = address.shipping.city.trim();

          if (address.shipping.city == "") {
            return res.status(400).send({
              status: false,
              message: "Please provide shipping city value",
            })
          }
        }
        // ======================pincode 

        if (address.shipping.pincode) {

          if (typeof address.shipping.pincode != "number") {
            return res.status(400).send({
              status: false,
              message: "shipping pincode  will be in number ",
            });
          }

          if (address.shipping.pincode == "") {
            return res.status(400).send({
              status: false,
              message: "Please provide shipping pincode value",
            })
          }

          if (!validation.validatePincode(address.shipping.pincode)) { return res.status(400).send({ status: false, message: "please provide valid shipping pincode" }) }


        }
        //====== address billing ====

        if (address.billing) {

          if (typeof address.billing != "object")
            return res.status(400).send({
              status: false,
              message: "Address of billing should be in Object format ",
            });

          if (address.billing.city) {

            if (typeof address.billing.city != "string") {
              return res.status(400).send({
                status: false,
                message: "shipping city will be in string ",
              });
            }


            address.city = userData.address.billing.city = address.billing.city.trim();

            if (address.billing.city == "") {
              return res.status(400).send({
                status: false,
                message: "Please provide shipping city value",
              })
            }
          }
          // ======================pincode 

          if (address.billing.pincode) {

            if (typeof address.billing.pincode != "number") {
              return res.status(400).send({
                status: false,
                message: "billing pincode  will be in number ",
              });
            }

            if (!validation.validatePincode(address.billing.pincode)) { return res.status(400).send({ status: false, message: "please provide valid billing pincode" }) }

            if (address.billing.pincode == "") {
              return res.status(400).send({
                status: false,
                message: "Please provide billing pincode value",
              })
            }
          }
        }
      }
    }

    // progile image
    profileImage = userData.profileImage = req.image

    const updatedUser = await userModel.findByIdAndUpdate({ _id: userId },
      {
        $set: { fname: fname, lname: lname, email: email, profileImage: profileImage, phone: phone, password: userData.password, address: address },
      }, { new: true });

    return res.status(200).send({ status: true, message: "User profile updated", data: updatedUser })

  } catch (error) {
    return res.status(500).send({ status: false, data: error.message })
  }
}

module.exports = { loginUser, register, getUser, UpdateUser }