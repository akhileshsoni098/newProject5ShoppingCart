const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const productController=require("../controllers/productController")
const auth = require('../middlewares/auth')
const aws = require("../middlewares/awsLink");


//USER
router.post("/register", aws.awsLink, userController.register);
router.post("/login", userController.loginUser)
router.get('/user/:userId/profile', auth.authentication, userController.getUser)
router.put('/user/:userId/profile',aws.awsUpdate, auth.authentication, auth.authorization, userController.UpdateUser)

//PRODUCT
router.post("/products",aws.awsProduct, productController.createProduct);
router.get("/products", productController.getProduct);
router.get('/products/:productId', productController.getByParam)
router.delete('/products/:productId',  productController.deleteProduct)

module.exports = router;
