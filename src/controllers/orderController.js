const cartModel = require("../models/cartModel")
const userModel = require("../models/userModel")
const orderModel = require("../models/orderModel")
const { isValidObjectId } = require('mongoose')

const createOrder = async (req, res) => {
    try {
        let userId = req.params.userId;
        if (!isValidObjectId(userId)) return res.status(400).send({ status: false, message: "provide valid user id " });

        let data = req.body
        let { cartId, cancellable, status } = data;

        console.log(typeof cancellable, typeof cartId);
        // let checkEmpty = Object.keys(data)        
        // for (i of checkEmpty) {
        //     data[i] = data[i].trim()
        //   if (data[i] == "")
        //     return res.send({ status: false, message: `${i} can not be Empty` })
        // }

        if (cancellable) {

            cancellable = data.cancellable = cancellable.trim()

            if (cancellable = '') return res.status(400).send({ status: false, message: "Please provide valid cancellable value" });
            // if (cancellable == false) cancellable = false

            cancellable = (cancellable == true) ? true : false
        }

        if (status) {
            status = data.status = status.trim()
            if (!["pending", "completed", "cancelled"].includes(status))
                return res.status(400).send({ status: false, message: "Please provide mandatory data to create order " });
        }

        if (Object.keys(data).length == 0) return res.status(400).send({ status: false, message: "Please provide mandatory data to create order " });

        if (!cartId) return res.status(404).send({ status: false, message: "Please send CartId" });

        cartId = data.cartId = cartId.trim();
        if (cartId == "")
            return res.status(400).send({ status: false, message: "Please enter cartId value" });

        if (!isValidObjectId(cartId)) return res.status(400).send({ status: false, message: "provide valid cart id " });

        let cartData = await cartModel.findOne({ userId: userId, _id: cartId }).select({ _id: 0, __v: 0, createdAt: 0, updatedAt: 0 }).lean();

        if (!cartData) return res.status(404).send({ status: false, message: "No cart Found for this user" });

        let userData = await userModel.findById(userId);
        if (!userData) return res.status(404).send({ status: false, message: "No user found for this id " });

        let quantity = 0;
        for (let i = 0; i < cartData.items.length; i++) {
            quantity += cartData.items[i].quantity
        }
        let obj = {
            ...cartData,
            totalQuantity: quantity,
            cancellable: cancellable,
            status: status
        };

        let orderData = await orderModel.create(obj);
        res.status(200).send({ status: false, data: orderData });

    }
    catch (err) { res.status(500).send({ status: false, message: err.message }) }
};

const updateOrder = async (req, res) => {

    let userId = req.params.userId

    if (!isValidObjectId(userId)) return res.status(400).send({ status: false, message: "provide valid user id " });

    let data = req.body
    let { orderId, status } = data

    if (Object.keys(data).length == 0) return res.status(400).send({ status: false, message: "Please provide mandatory data to create order " });

    if (!orderId) return res.status(400).send({ status: false, message: "orderId is mandatary" })

    orderId = data.orderId = orderId.trim();
    if (orderId == "")
        return res.status(400).send({ status: false, message: "Please enter orderId value" });

    if (!isValidObjectId(orderId)) return res.status(400).send({ status: false, message: "provide valid cart id " });

    if (!status) return res.status(400).send({ status: false, message: "Please provide status to update" });

    status = data.status = status.trim()
    if (!["pending", "completed", "cancelled"].includes(status))
        return res.status(400).send({ status: false, message: "Status can only conatin pending, completed, cancelled" });

    let userExist = await userModel.findById(userId)

    if (!userExist) return res.status(400).send({ status: false, message: "User not exist " })

    let checkOrder = await orderModel.findById(orderId)
    if (checkOrder.userId !== userId) { return res.status(400).send({ status: false, message: "user is not applicable for this order" }) }

    if (checkOrder.status !== 'completed' || checkOrder.cancellable == false && status == 'cancelled') return res.status(400).send({ status: false, message: "This order is not cancellable" })

    let updateOrders = await orderModel.findOneAndUpdate({ _id: orderId, cancellable: true }, { status: status }, { new: true })

    res.status(200).send({ status: false, data: updateOrders })
}

module.exports = { createOrder, updateOrder };