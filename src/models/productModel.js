const mongoose = require("mongoose");

const productSchema = mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            unique: true,
            trim:true
        },

        description: {
            type: String,
            required: true,
        },

        price: {
            type: Number,
            required: true,
        }, //valid number/decimal

        currencyId: {
            type: String,
            required: true,
            default: "INR"
        },

        currencyFormat: {
            type: String,
            required: true
        }, // Rupee symbol

        isFreeShipping: {
            type: Boolean,
            default: false
        },

        productImage: {
            type: String,
            required: true
        }, // s3 link

        style: {
            type: String
        },

        availableSizes: {
            type: [String],
            enum: ["S", "XS", "M", "X", "L", "XXL", "XL"],
        }, //array of string, at least one size

        installments: {
            type: Number
        },

        deletedAt: {
            type: Date
        }, //when the document is deleted

        isDeleted: {
            type: Boolean,
            default: false
        },
    },
    { timestamp: true }
);

module.exports = mongoose.model('product', productSchema)