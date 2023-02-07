const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;

const cartSchema = new mongoose.Schema(
    {
        userId: {
            type: ObjectId
        },
        items: [{
            productId: {
                type: ObjectId,
                required: true,
                // unique: true
            },
            quantity: {
                type: Number,
                required: true,
                min: 1
            }
        }],
        totalPrice: {
            type: Number,
            // required: true
        },
        totalItems: {
            type: Number,
            // required: true
        },
        // isDeleted:{
        //     type:Boolean,
        //     default:false
        // }
    }, { timestamps: true })


module.exports = mongoose.model('Cart', cartSchema)