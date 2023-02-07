const { isValidObjectId } = require("mongoose");
const cartModel = require("../models/cartModel");
const userModel = require("../models/userModel");
const productModel = require("../models/productModel");

const createCart = async function (req, res) {
    try {
        const userId = req.params.userId
        const cartData = req.body;

        let { cartId, productId } = cartData;

        if (Object.keys(cartData).length == 0) {
            return res.status(400).send({ status: false, message: "can't create data with empty body" })
        }

        if (cartId) {
            cartId = data.cartId= cartId.trim();
            if (!isValidObjectId(cartId)) return res.status(400).send({ status: false, message: " Valid CartID!" })
            var cartExist = await cartModel.findOne({ _id: cartId, userId: userId })
            if (!cartExist) return res.status(404).send({ status: false, message: "No cart found" })
        }

        if (!productId) return res.status(400).send({ status: false, message: "Product id is mandatory " })

        productId = data.productId = productId.trim();
        if (!isValidObjectId(productId)) return res.status(400).send({ status: false, message: " Invalid product ID!" })
        let product = await productModel.findOne({ _id: productId, isDeleted: false })
        if (!product) return res.status(400).send({ status: false, message: "Product doesn't exists!" })

        if (cartData.quantity == 0) return res.status(400).send({ status: false, message: "You can't add 0 quantity of any item in your cart" })
        if (!cartData.quantity) {
            cartData.quantity = 1
        }

        let quantity = cartData.quantity
        let totalPrice = product.price * quantity

        if (cartId) {

            let productPresent = cartExist.items
            for (let i = 0; i < productPresent.length; i++) {
                if (productPresent[i].productId == productId) {
                    let index = i
                    let updatedproduct = productPresent[i]
                    updatedproduct.quantity += quantity
                    // At position index, add 1 elements, remove 1:
                    productPresent.splice(index, 1, updatedproduct)

                    price = cartExist.totalPrice + (product.price * quantity)

                    totalItem = productPresent.length

                    let cart = await cartModel.findOneAndUpdate({ _id: cartId }, { items: productPresent, totalPrice: price, totalItems: totalItem }, { new: true })

                    return res.status(200).send({ status: true, data: cart })
                }
            }

            let newItem = {
                productId: productId,
                quantity: quantity
            }
            price = cartExist.totalPrice + (product.price * quantity)

            cartExist.items.push(newItem)
            totalItem = cartExist.items.length

            let cart = await cartModel.findByIdAndUpdate({ _id: cartId }, { items: productPresent, totalPrice: price, totalItems: totalItem }, { new: true })
            return res.status(200).send({ status: true, data: cart })
        }

        let items = {
            productId: productId,
            quantity: quantity
        }

        let cartAlreadyExist = await cartModel.findOne({ userId: userId })
        console.log(cartAlreadyExist)
        if (cartAlreadyExist) {
            return res.status(400).send({ status: false, message: "Cart already exist for this user, Please send cart id in request" })
        }
        let cart = await cartModel.create({ userId: userId, items: items, totalPrice: totalPrice, totalItems: 1 })

        return res.status(201).send({ status: true, data: cart })
    } catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}

const updateCart = async function (req, res) {

    try {
        let { productId, cartId, removeProduct } = req.body
        let userId = req.params.userId

        if (!removeProduct)
            return res.status(400).send({ status: false, message: " Please send removeProduct attribute" })

        removeProduct = Number(removeProduct)

        if (isNaN(removeProduct) || removeProduct !== 1 && removeProduct !== 0)
            return res.status(404).send({ status: false, message: "removeProduct can only contain +1(Remove 1 quantity) or 0(Remove all quantity)" })

        if (!isValidObjectId(userId)) return res.status(400).send({ status: false, message: " Invalid CartID!" })

        if (Object.keys(req.body).length == 0)
            return res.status(400).send({ status: false, message: "can't create data with empty body" })

        if (!productId) return res.status(400).send({ status: false, message: "Product id is mandatory " })

        productId = data.productId = productId.trim();
        if (!isValidObjectId(productId)) return res.status(400).send({ status: false, message: " Invalid product ID!" })
        let product = await productModel.findById(productId)


        if (!cartId) return res.status(400).send({ status: false, message: "Cart id is mandatory " })

        cartId = data.cartId = cartId.trim();
        if (!isValidObjectId(cartId)) return res.status(400).send({ status: false, message: " Valid CartID!" })

        let isCartExist = await cartModel.findOne({ _id: cartId, userId: userId })

        if (!isCartExist) return res.status(400).send({ status: false, message: "Cart not exist for this user" })

        let isMatchProductId = isCartExist.items.findIndex((x) => { return x.productId.toString() == req.body.productId })

        if (isMatchProductId == -1) return res.status(400).send({ status: false, message: "This product is not available in your cart" })

        let totalItems = isCartExist.totalItems, totalPrice;
        if (removeProduct == 1) {
            if (isCartExist.items[isMatchProductId].quantity > 0) {
                isCartExist.items[isMatchProductId].quantity -= 1

                totalPrice = isCartExist.totalPrice - product.price
            }
            if (isCartExist.items[isMatchProductId].quantity == 0) {
                isCartExist.items.splice(isMatchProductId, 1)
                totalItems = isCartExist.totalItems - 1
            }
        }

        if (removeProduct == 0) {
            isCartExist.items.splice(isMatchProductId, 1)
            totalItems = isCartExist.totalItems - 1
            totalPrice = isCartExist.totalPrice - (product.price * isCartExist.items[isMatchProductId].quantity)
        }

        console.log(totalItems, totalPrice);

        let save = await cartModel.findOneAndUpdate({ _id: cartId }, { items: isCartExist.items, totalPrice: totalPrice, totalItems: totalItems }, { new: true })
        return res.status(200).send({ status: true, message: 'Success', data: save })

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

const getCart = async (req, res) => {
    try {
        const userId = req.params.userId

        if (!isValidObjectId(userId)) return res.status(400).send({ status: false, message: "provide valid user id " })
        let userData = await userModel.findById(userId)
        if (!userData) return res.status(404).send({ status: false, message: "No user found" })

        let cartSummary = await cartModel.findOne({ userId: userId })
        if (!cartSummary) return res.status(404).send({ status: false, message: "Your cart is empty" })
        res.status(200).send({ status: true, data: cartSummary })
    }
    catch (err) { res.status(500).send({ status: false, message: err.message }) }
}

const deleteCart = async (req, res) => {
    try {
        const userId = req.params.userId

        if (!isValidObjectId(userId)) return res.status(400).send({ status: false, message: "provide valid user id " })
        let userData = await userModel.findById(userId)
        if (!userData) return res.status(404).send({ status: false, message: "No user found" })

        let cartData = await cartModel.findOne({ userId: userId })
        if (!cartData) return res.status(404).send({ status: false, message: "No cart Found" })

        if (cartData.items.length == 0) return res.status(404).send({ status: false, message: "Cart is empty now" })


        let items = cartData.items
        while (items.length != 0) {
            for (let i = 0; i < items.length; i++) {
                console.log(items[i])
                items.shift(items[i])

            }
            console.log(items)
        }

        totalPrice = cartData.totalPrice == 0
        totalItems = cartData.totalItems == 0

        const deleteCart = await cartModel.findOneAndUpdate({ userId: userId },
            { $set: { items: cartData.items, totalPrice: totalPrice, totalItems: totalItems } }, { new: true })

        return res.status(200).send({ status: false, message: "cart has been deleted", data: deleteCart })
    }
    catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }
}


module.exports = { createCart, updateCart, getCart, deleteCart }