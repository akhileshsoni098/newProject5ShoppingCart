const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const productController=require("../controllers/productController")
const cartController=require("../controllers/cartController")
const orderController=require('../controllers/orderController')
const auth = require('../middlewares/auth')
const aws = require("../middlewares/awsLink");

//USER
router.post("/register",aws.awsLink,  userController.register);
router.post("/login", userController.loginUser)
router.get('/user/:userId/profile', auth.authentication, userController.getUser)
router.put('/user/:userId/profile',aws.awsUpdate, auth.authentication, auth.authorization, userController.UpdateUser)

//PRODUCT
router.post("/products",aws.awsProduct, productController.createProduct);
router.get("/products", productController.getProduct);
router.get('/products/:productId', productController.getProductById)
router.put('/products/:productId',aws.awsUpdate, productController.updateProduct)
router.delete('/products/:productId',  productController.deleteProduct)

//Cart
router.post("/users/:userId/cart", auth.authentication, auth.authorization, cartController.createCart);
router.put("/users/:userId/cart", auth.authentication, auth.authorization, cartController.updateCart);
router.get("/users/:userId/cart", auth.authentication, auth.authorization, cartController.getCart);
router.delete("/users/:userId/cart", auth.authentication, auth.authorization, cartController.deleteCart);

//Order
router.post("/users/:userId/orders",auth.authentication, auth.authorization, orderController.createOrder);
router.put("/users/:userId/orders",auth.authentication, auth.authorization, orderController.updateOrder);

router.all('*/', function(req, res){
    return res.status(400).send({status:false, message:"Invalid Path"})
})

module.exports = router;
