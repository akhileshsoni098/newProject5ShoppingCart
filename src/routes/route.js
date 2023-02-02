const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const auth = require('../middlewares/auth')
const aws = require("../middlewares/awsLink");


router.post("/register", aws.awsLink, userController.register);
router.post("/login", userController.loginUser)
router.get('/user/:userId/profile', auth.authentication, userController.getUser)
router.put('/user/:userId/profile',aws.awsLink, auth.authentication, auth.authorization, userController.UpdateUser)

module.exports = router;
