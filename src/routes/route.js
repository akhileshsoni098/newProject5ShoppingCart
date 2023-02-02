const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

router.post("/register", userController.register);
router .post("/logIn",   userController.loginUser)


module.exports = router;
