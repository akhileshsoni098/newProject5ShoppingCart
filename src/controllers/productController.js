const productModel = require('../models/productModel')
const { isValidObjectId } = require('mongoose')
const isValid=require('../validations/validation')

const createProduct = async (req, res) => {
    try {
        const productData = req.body

        let { title, description, price, currencyId, currencyFormat, style, availableSizes, installments, } = productData

        if (Object.keys(productData).length == 0)
            return res.status(400).send({ status: false, message: "please provide required fields" });

        //===========  title  ===========

        if (!title) { return res.status(400).send({ status: false, message: "please provide title" }) }

        if (typeof title != "string")
            return res.status(400).send({ status: false, message: "title should be in string" });

        title = productData.title = title.trim();

        if (title == "")
            return res.status(400).send({ status: false, message: "Please Enter title value" });

        if (!isValid.validateTitle(title))
            return res.status(400).send({ status: false, message: "Please Enter  valid title" });

        let titleExist = await productModel.findOne({ title: title })
        if (titleExist) return res.status(400).send({ status: true, message: "This title is already exist in" })


        // ==============   description validation ======

        if (!description) { return res.status(400).send({ status: false, message: "please provide description" }) }

        if (typeof description != "string") {
            return res.status(400).send({ status: false, message: "description should be in string" });
        }

        description = productData.description = description.trim();

        if (description == "")
            return res.status(400).send({ status: false, message: "Please Enter description value" });

        if (!isValid.validateTitle(description))
            return res.status(400).send({ status: false, message: "Please Enter  valid description" });

        //=============================== price validation =============

        if (!price) return res.status(400).send({ status: false, message: "please provide price" })

        price = productData.price = price.trim()
        if (price == "") return res.status(400).send({ status: false, message: "please provide price value" })

        price = productData.price = Number(price)

        if (isNaN(price) || typeof price != "number") return res.status(400).send({ status: false, message: "price should be in number" });

        if (!isValid.validatePrice(price)) return res.status(400).send({ status: false, message: "please provide valid price" })
        price = productData.price = price.toFixed(2)

        // ============================== currencyId: {string, mandatory, INR} =====

        if (!currencyId) return res.status(400).send({ status: false, message: "please provide currencyId" })

        if (typeof currencyId != "string")
            return res.status(400).send({ status: false, message: "currencyId should be in string" });


        currencyId = productData.currencyId = currencyId.trim();

        if (currencyId == "")
            return res.status(400).send({ status: false, message: "Please Enter currencyId value" });

        if (productData.currencyId != "INR") return res.status(400).send({ status: false, message: "opps enter INR " })


        //==========================  currencyFormat {string, mandatory, Rupee symbol},


        if (!currencyFormat) { return res.status(400).send({ status: false, message: "please provide currencyFormat" }) }

        if (typeof currencyFormat != "string")
            return res.status(400).send({ status: false, message: "currencyFormat should be in string" });
        currencyFormat = productData.currencyFormat = currencyFormat.trim();

        if (currencyFormat == "")
            return res.status(400).send({ status: false, message: "Please Enter currencyFormat value" });

        if (productData.currencyFormat != "₹") return res.status(400).send({ status: false, message: "Please enter ₹ " })

        //========================= productImage ========

        productImage = req.files

        if (!productImage) { return res.status(400).send({ status: false, message: "please provide productImage" }) }

        productData.productImage = req.image


        //=============================  style: {string},

        if (style || Object.values(style).length == 0) {

            if (typeof style != "string")
                return res.status(400).send({ status: false, message: "style should be in string" });
            style = productData.style = style.trim();

            if (Object.values(style).length == 0 || style == "")
                return res.status(400).send({ status: false, message: "Please Enter style value" });

            if (!isValid.validateTitle(style))
                return res.status(400).send({ status: false, message: "Please Enter  valid style" });
        }

        //=======================availableSizes: {array of string, at least one size, enum["S", "XS","M","X", "L","XXL", "XL"]}


        if (availableSizes || Object.values(availableSizes)==0) {
            let count=0;
            if (typeof availableSizes != "string") return res.status(400).send({ status: false, message: `Please Enter sizes in string` })

            availableSizes= productData.availableSizes=productData.availableSizes.trim()

            if (availableSizes == null || availableSizes == undefined || Object.values(availableSizes).length == 0) 
                return res.status(400).send({ status: false, message: `Please Enter at least one size` })

            let temp = []
            let size = availableSizes.split(",").map(x => x.trim())

            temp = size
            size.forEach((size) => {
                if (!(["S", "XS", "M", "XL", "XXL", "L"].includes(size))) count++;
            })
            if(count>0) return res.status(400).send({ status: false,message: "Size can only contain S, XS, M, XL, XXL, L"})

            productData.availableSizes = temp

    }
        // ==== installments: {number}

        if (installments) {

            if (typeof installments != "string")
                return res.status(400).send({ status: false, message: "style should be in string" });

            installments = productData.installments = installments.trim()

            if (installments == "") return res.status(400).send({ status: false, message: "Please Enter installments value" });

            installments = productData.installments = Number(installments)

            if (typeof installments != "number") return res.status(400).send({ status: false, message: "installments should be in number" });

            if (!isValid.validateInstallments(installments)) return res.status(400).send({ status: false, message: "please provide valid installment" })

        }

        let createProduct = await productModel.create(productData)
        return res.status(201).send({ status: false, data: createProduct })
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message})
    }
}

const getProduct = async (req, res) => {

    try {
        let data = req.query
        let { size, name, priceGreaterThan, priceLessThan, priceSort } = data

        let abc = Object.keys(data)
        for (i of abc) {
            if (data[i].trim() == "")
                return res.status(400).send({ status: false, message: `${i} can not be Empty` })
        }

        let expectedQueries = ["size", "name", "priceGreaterThan", "priceLessThan", "priceSort"];
        let queries = Object.keys(data);
        let count = 0;
        for (let i = 0; i < queries.length; i++) {
            if (!expectedQueries.includes(queries[i])) count++;
        }
        if (count > 0)
            return res.status(400).send({ status: false, message: "queries can only have size, name, priceGreaterThan, priceLessThan, priceSort" });

        let filter = { isDeleted: false, }

        if (name) {
            if (typeof name != "string")
                return res.status(400).send({ status: false, message: "name string should be in string" });

            filter.title = name
        }

        if (size) {
            if (typeof size != "string") return res.status(400).send({ status: false, message: `Please Enter sizes in string` })

            let temp = []
            let sizes = size.split(",").map(x => x.trim())

            temp = sizes
            sizes.forEach((i) => {
                if (!(["S", "XS", "M", "XL", "XXL", "L"].includes(i))) {
                    return res.status(400).send({ status: false, message: `Please Enter sizes S, XS, M, XL, XXL, L ` })
                }
                data.size = temp
            })

            filter.availableSizes = sizes
        }

        if (priceGreaterThan) {
            priceGreaterThan = data.priceGreaterThan = priceGreaterThan.trim()
            priceGreaterThan = data.priceGreaterThan = Number(priceGreaterThan)

            if (isNaN(priceGreaterThan) || typeof priceGreaterThan !== 'number')
                return res.status(404).send({ status: false, message: "Price Greater than can only contain numbers" })

            filter['price'] = { $gt: priceGreaterThan }
        }

        if (priceLessThan) {
            priceLessThan = data.priceLessThan = priceLessThan.trim()
            priceLessThan = data.priceLessThan = Number(priceLessThan)

            if (isNaN(priceLessThan) || typeof priceLessThan !== 'number')
                return res.status(404).send({ status: false, message: "Price Less than can only contain numbers" })

            filter['price'] = { ...filter['price'], $lt: priceLessThan }
        }

        let sort = 1
        if (priceSort) {

            priceSort = data.priceSort = priceSort.trim()
            priceSort = data.priceSort = Number(priceSort)

            if (isNaN(priceSort) || priceSort !== 1 && priceSort !== (-1)) {
                return res.status(404).send({ status: false, message: "sortPrice can only contain +1(Ascending) & -1(Descending)" })
            }

            sort = priceSort
        }

        let getProduct = await productModel.find(filter).sort({ price: sort })

        if (getProduct.length == 0) return res.status(404).send({ status: false, message: "No Product for this Filter" })

        return res.status(200).send({ status: true, message: 'Success', data: getProduct })

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

const getProductById = async (req, res) => {
    try {
        let productId = req.params.productId
        console.log(productId);
        if (!isValidObjectId(productId))
            return res.status(400).send({ status: false, message: "Invalid product Id " })

        const getProducts = await productModel.findById(productId)

        if (!getProducts)
            return res.status(404).send({ status: false, message: "No product found" })

        if (getProducts.isDeleted == true) return res.status(404).send({ status: false, message: "Product is already Deleted" })

        res.status(200).send({ status: true, message: "success", data: getProducts })

    } catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}

// ### PUT /products/:productId
// - Updates a product by changing at least one or all fields
// - Check if the productId exists (must have isDeleted false and is present in collection). If it doesn't, return an HTTP status 404 with a response body like [this](#error-response-structure)
// - _Response format_
//   - *On success* - Return HTTP status 200. Also return the updated product document. The response should be a JSON object like [this](#successful-response-structure)
//   - *On error* - Return a suitable error message with a valid HTTP status code. The response should be a JSON object like [this](#error-response-structure)

const updateProduct = async (req, res) => {

    try {

        let productId = req.params.productId
        let data = req.body
        let { title, description, price, style, availableSizes, installments } = data

        let productImage = req.files


        if (Object.keys(data).length !== 0) {


            console.log(title)
            let abc = Object.keys(data)
            for (i of abc) {
                if (data[i].trim() == "")
                    return res.send({ status: false, message: `${i} can not be Empty` })
            }
        }

        if (productImage) {
            data.length += 1
        }


        if (Object.keys(data).length == 0) {
            return res.status(400).send({ status: false, message: "Please provide some value" })
        }

        if (!isValidObjectId(productId))
            return res.status(400).send({ status: false, message: "Invalid product Id " })

        const getProducts = await productModel.findOne({ _id: productId, isDeleted: false })

        if (!getProducts)
            return res.status(404).send({ status: false, message: "No product found" })

        if (title) {
            if (typeof title != "string") {
                return res.status(400).send({ status: false, message: "title should be in string" });
            }


            // regex  ==================================== remains

            let titleExist = await productModel.findOne({ title: title })
            if (titleExist) return res.status(400).send({ status: true, message: "This title is already exist please send another title" })

        }

        if (description) {
            if (typeof description != "string") 
                return res.status(400).send({ status: false, message: "description should be in string" });
        }



        //=============================== price validation =============

        if (price) {
            price = data.price = Number(price)

            if (isNaN(price) || typeof price != "number") return res.status(400).send({ status: false, message: "price should be in number" });


            // =============== regex  valid number ======================

            price = data.price = price.toFixed(2)
        }

        //========================= productImage ========

        if (productImage) {

            productImage = req.files

            if (!productImage) { return res.status(400).send({ status: false, message: "please provide productImage" }) }

            data.productImage = req.image

        }


        //=============================  style: {string},

        if (style) {

            if (typeof style != "string") {
                return res
                    .status(400)
                    .send({ status: false, message: "style should be in string" });
            }


        }

        if (availableSizes || Object.values(availableSizes)==0) {
            let count=0;
            if (typeof availableSizes != "string") return res.status(400).send({ status: false, message: `Please Enter sizes in string` })

            availableSizes= data.availableSizes=data.availableSizes.trim()

            if (availableSizes == null || availableSizes == undefined || Object.values(availableSizes).length == 0) 
                return res.status(400).send({ status: false, message: `Please Enter at least one size` })

            let temp = []
            let size = availableSizes.split(",").map(x=>x.trim())

            temp = size
            size.forEach((size) => {
                if (!(["S", "XS", "M", "XL", "XXL", "L"].includes(size))) count++;
            })
            if(count>0) return res.status(400).send({ status: false,message: "Size can only contain S, XS, M, XL, XXL, L"})

            data.availableSizes = temp

    }

        // ==== installments: {number}

        if (installments) {

            installments = data.installments = Number(installments)

            if (isNaN(installments) || typeof installments != "number") return res.status(400).send({ status: false, message: "installments should be in number" });

            // what is use to (should we use regex )

        }

        let updateData = await productModel.findOneAndUpdate({ _id: productId }, { $set: { title: title, description: description, price: price, style: style, productImage: req.image, availableSizes: availableSizes, installments: installments } }, { new: true })
        
        return res.status(200).send({ status: true, message: "Successfully updated", data: updateData })


    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }

}

const deleteProduct = async function (req, res) {
    try {
        const productId = req.params.productId

        if (!isValidObjectId(productId)) {
            return res.status(400).send({ status: false, message: "invlaid object Id " })
        }

        let checkProducts = await productModel.findById(productId)

        if (!checkProducts)
            return res.status(404).send({ status: false, message: "No product found for this ID" })

        if (checkProducts.isDeleted == true)
            return res.status(400).send({ status: false, message: "Product already deleted" })


        let deletePro = await productModel.findOneAndUpdate({ _id: productId, isDeleted: false },
            { $set: { isDeleted: true, deletedAt: Date.now() } })

        return res.status(200).send({ status: true, message: "success", message: "deleted successfully " })

    } catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}



module.exports = { createProduct, getProduct, getProductById, deleteProduct, updateProduct }