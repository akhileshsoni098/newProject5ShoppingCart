const { isValidObjectId } = require('mongoose')
const productModel = require('../models/productModel')

const createProduct = async (req, res) => {
    try {
        const productData = req.body

        let { title, description, price, currencyId, currencyFormat, style, availableSizes, installments, } = productData

        //===========  title  ===========

        if (!title) { return res.status(400).send({ status: false, message: "please provide title" }) }

        if (typeof title != "string") {
            return res.status(400).send({ status: false, message: "title should be in string" });
        }

        title = productData.title = title.trim();

        if (title == "")
            return res.status(400).send({ status: false, message: "Please Enter title value" });

        // regex  ==================================== remains

        let titleExist = await productModel.findOne({ title: title })
        if (titleExist) return res.status(400).send({ status: true, message: "This title is already exist in" })


        // ==============   description validation ======

        if (!description) { return res.status(400).send({ status: false, message: "please provide description" }) }

        if (typeof description != "string") {
            return res
                .status(400)
                .send({ status: false, message: "description should be in string" });
        }

        description = productData.description = description.trim();

        if (description == "")
            return res
                .status(400)
                .send({ status: false, message: "Please Enter description value" });

        //=============================== price validation =============

        if (!price) return res.status(400).send({ status: false, message: "please provide price" })

        price = productData.price = price.trim()
        if (price == "") return res.status(400).send({ status: false, message: "please provide price value" })

        price = productData.price = Number(price)

        if (isNaN(price) || typeof price != "number") return res.status(400).send({ status: false, message: "price should be in number" });

        // =============== regex  valid number ======================

        price = productData.price = price.toFixed(2)

        //200 
        // ============================== currencyId: {string, mandatory, INR} =====

        if (!currencyId) return res.status(400).send({ status: false, message: "please provide currencyId" })

        if (typeof currencyId != "string") {
            return res
                .status(400)
                .send({ status: false, message: "currencyId should be in string" });
        }

        currencyId = productData.currencyId = currencyId.trim();

        if (currencyId == "")
            return res
                .status(400)
                .send({ status: false, message: "Please Enter currencyId value" });

        if (productData.currencyId != "INR") { return res.status(400).send({ status: false, message: "opps enter INR " }) }


        //==========================  currencyFormat {string, mandatory, Rupee symbol},


        if (!currencyFormat) { return res.status(400).send({ status: false, message: "please provide currencyFormat" }) }

        if (typeof currencyFormat != "string") {
            return res
                .status(400)
                .send({ status: false, message: "currencyFormat should be in string" });
        }

        currencyFormat = productData.currencyFormat = currencyFormat.trim();

        if (currencyFormat == "")
            return res
                .status(400)
                .send({ status: false, message: "Please Enter currencyFormat value" });

        if (productData.currencyFormat != "₹") { return res.status(400).send({ status: false, message: "Please enter ₹ " }) }

        //========================= productImage ========

        productImage = req.files

        if (!productImage) { return res.status(400).send({ status: false, message: "please provide productImage" }) }

        productData.productImage = req.image


        //=============================  style: {string},

        if (style) {

            if (typeof style != "string") {
                return res
                    .status(400)
                    .send({ status: false, message: "style should be in string" });
            }

            style = productData.style = style.trim();

            if (style == "")
                return res
                    .status(400)
                    .send({ status: false, message: "Please Enter style value" });
        }

        //=======================availableSizes: {array of string, at least one size, enum["S", "XS","M","X", "L","XXL", "XL"]}

        if (availableSizes) {

            // availableSizes = JSON.parse(availableSizes) DOUBT
            if (typeof availableSizes != "string") return res.status(400).send({ status: false, message: `Please Enter sizes in string` })


            let temp = []
            let size = availableSizes.split(",").map(x => x.trim())

            temp = size
            size.forEach((size) => {
                if (!(["S", "XS", "M", "XL", "XXL", "L"].includes(size))) {
                    return res.status(400).send({ status: false, message: `Please Enter sizes S, XS, M, XL, XXL, L ` })
                }
                productData.availableSizes = temp
            })
        }

        // ==== installments: {number}

        if (installments) {

            if (typeof installments != "string") {
                return res
                    .status(400)
                    .send({ status: false, message: "style should be in string" });
            }

            installments = productData.installments = installments.trim()

            if (installments == "") return res.status(400).send({ status: false, message: "Please Enter installments value" });

            installments = productData.installments = Number(installments)

            if (typeof installments != "number") return res.status(400).send({ status: false, message: "installments should be in number" });

            // what is use to (should we use regex )

        }

        let createProduct = await productModel.create(productData)
        return res.status(201).send({ status: false, data: createProduct })
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

const getProduct = async (req, res) => {

    try {
        let data = req.query
        let {size, name, priceGreaterThan, priceLessThan } = data

        let abc=Object.keys(data)
        for(i of abc){            
            if (data[i].trim()=="") 
                return res.send(`${i} can not be Empty`)
        }

        let expectedQueries = ["size", "name", "priceGreaterThan", "priceLessThan"];
        let queries = Object.keys(data);
        let count = 0;
        for (let i = 0; i < queries.length; i++) {
            if (!expectedQueries.includes(queries[i])) count++;
        }
        if (count > 0)
            return res.status(400).send({ status: false, message: "queries can only have size, name, priceGreaterThan, priceLessThan" });

        let filter = { isDeleted: false, }

        if (name ) {

            if (typeof name != "string")
                return res.status(400).send({ status: false, message: "name string should be in string" });

            filter.title = name
        }

        if (size ) {

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

        if (priceGreaterThan ) filter['price'] = { $gt: priceGreaterThan }

        if (priceLessThan ) filter['price'] = { ...filter['price'], $lt: priceLessThan }

        // console.log(filter);

        let getProduct = await productModel.find(filter).sort({ price: 1 })

        if (getProduct.length == 0) return res.status(404).send({ status: false, message: "No Product for this Filter" })

        return res.status(200).send({ status: true, message: 'Success', data: getProduct })

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}




// ### GET /products/:productId
// - Returns product details by product id
// - __Response format__
//   - _**On success**_ - Return HTTP status 200. Also return the product documents. The response should be a JSON object like [this](#successful-response-structure)
//   - _**On error**_ - Return a suitable error message with a valid HTTP status code. The response should be a JSON object like [this](#error-response-structure)

const getByParam = async function (req, res){
try{
    const productId = req.params.productId

    if(!isValidObjectId(productId)){
        return res.status(400).send({staus:false , message:"invlaid object Id "})
    }

const getProducts = await productModel.findOne({_id:productId, isDeleted:false })

if(!getProducts){
    return res.status(404).send({staus:false , message:"no product found"})
}
res.status(200).send({staus:false , message:"success", data:getProducts})

}catch (err){
    return res.status(500).send({status:false , message:err.message})
}
}


// ### DELETE /products/:productId
// - Deletes a product by product id if it's not already deleted
// - __Response format__
//   - _**On success**_ - Return HTTP status 200. The response should be a JSON object like [this](#successful-response-structure)
//   - _**On error**_ - Return a suitable error message with a valid HTTP status code. The response should be a JSON object like [this](#error-response-structure)



const deleteProduct = async function (req, res){
    try{
        const productId = req.params.productId
    
        if(!isValidObjectId(productId)){
            return res.status(400).send({staus:false , message:"invlaid object Id "})
        }
    
    let checkProducts = await productModel.findOne({_id:productId, isDeleted:true})
    if(checkProducts){
        return res.status(400).send({staus:false , message:"product already deleted"})
    }
    if(!checkProducts){
        return res.status(404).send({staus:false , message:"no product found"})
    }
  let deletePro = await productModel.findOneAndUpdate({_id:productId , isDeleted:false},
    {$set:{isDeleted:false , deletedAt:Date.now()}}  )

   return res.status(200).send({staus:false , message:"success", message:"deleted successfully "})
    
    }catch (err){
        return res.status(500).send({status:false , message:err.message})
    }
    }
    




module.exports = { createProduct, getProduct, getByParam, deleteProduct }