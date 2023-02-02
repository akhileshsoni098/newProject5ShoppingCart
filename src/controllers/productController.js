const productModel=require('../models/productModel')

```yaml
{ 
  title: {string, mandatory, unique},
  description: {string, mandatory},
  price: {number, mandatory, valid number/decimal},
  currencyId: {string, mandatory, INR},
  currencyFormat: {string, mandatory, Rupee symbol},
  isFreeShipping: {boolean, default: false},
  productImage: {string, mandatory},  // s3 link
  style: {string},
  availableSizes: {array of string, at least one size, enum["S", "XS","M","X", "L","XXL", "XL"]},
  installments: {number},
  deletedAt: {Date, when the document is deleted}, 
  isDeleted: {boolean, default: false},
  createdAt: {timestamp},
  updatedAt: {timestamp},
}
```
// to do all regex part and availble sizes type of (availableSizes) 155 no.

const createProduct = async function (req , res){

    try{
    const productData = req.body

    const {title, description, price , currencyId,currencyFormat,productImage ,style,availableSizes,installments, } = productData



    //===========  title  ===========

    if(!title){res.status(400).send({status:false , message:"please provide title"})}

    if (typeof title != "string") {
        return res
          .status(400)
          .send({ status: false, message: "title should be in string" });
      }

      title = userData.title = title.trim();
  
      if (title == "")
        return res
          .status(400)
          .send({ status: false, message: "Please Enter title value" });
  
         // regex  ==================================== remains

const titleExist = await productModel.findOne({title:title})
if(titleExist){res.status(400).send({status:true , message:"This title is already exist in"})}


// ==============   description validation ======

if(!description){res.status(400).send({status:false , message:"please provide description"})}

if (typeof description != "string") {
    return res
      .status(400)
      .send({ status: false, message: "description should be in string" });
  }

  description = userData.description = description.trim();

  if (description == "")
  return res
    .status(400)
    .send({ status: false, message: "Please Enter description value" });

//=============================== price validation =============

if(!description){res.status(400).send({status:false , message:"please provide price"})}

if (typeof price != "number") {
    return res
      .status(400)
      .send({ status: false, message: "price should be in number" });
  }

// =============== regex  valid number ======================


price = productData.price = price.toFixed(2)


// ============================== currencyId: {string, mandatory, INR} =====


if(!currencyId){res.status(400).send({status:false , message:"please provide currencyId"})}

if (typeof currencyId != "string") {
    return res
      .status(400)
      .send({ status: false, message: "currencyId should be in string" });
  }

  currencyId = userData.currencyId = currencyId.trim();

  if (currencyId == "")
  return res
    .status(400)
    .send({ status: false, message: "Please Enter currencyId value" });

if(userData.currencyId != "INR"){res.status(400).send({status:false , message:"opps enter INR "})}  // doubt h work krega ya nhi 


//==========================  currencyFormat {string, mandatory, Rupee symbol},


if(!currencyFormat){res.status(400).send({status:false , message:"please provide currencyFormat"})}

if (typeof currencyFormat != "string") {
    return res
      .status(400)
      .send({ status: false, message: "currencyFormat should be in string" });
  }

  currencyFormat = userData.currencyFormat = currencyFormat.trim();

  if (currencyFormat == "")
  return res
    .status(400)
    .send({ status: false, message: "Please Enter currencyFormat value" });

if(userData.currencyFormat != "₹"){res.status(400).send({status:false , message:"opps enter ₹ "})}




   //========================= productImage: {string, mandatory} ========

   if(!productImage){res.status(400).send({status:false , message:"please provide productImage"})}

 productData.productImage = req.image


//=============================  style: {string},

if(style){

    if (typeof style != "string") {
        return res
          .status(400)
          .send({ status: false, message: "style should be in string" });
      }
    
      style = userData.style = style.trim();
    
      if (style == "")
      return res
        .status(400)
        .send({ status: false, message: "Please Enter style value" });
}

//=======================availableSizes: {array of string, at least one size, enum["S", "XS","M","X", "L","XXL", "XL"]}
if(availableSizes){

    if(typeof availableSizes != "array") // how to check doubt h ki array krun ya string ===

    availableSizes = userData.availableSizes = availableSizes.trim();

    if (!["S", "XS","M","X", "L","XXL", "XL"].includes(availableSizes))
    { res.status(400).send({status:false , message:"please provide sizes eg: (S, XS, M, X, L, XXL, XL) "}) }

}

// ==== installments: {number}

if(installments){

    if (typeof installments != "number") {
        return res
          .status(400)
          .send({ status: false, message: "installments should be in number" });
      }
    
// what is use to (should we use regex )
    
      if (installments == "")
      return res
        .status(400)
        .send({ status: false, message: "Please Enter installments value" });
}

const saveProduct = await productModel.create(productData)
res.status(201).send({status:false , data:saveProduct})  // right formet me response likhna h 
    }catch(err){

        res.status(500).send({status:false , message: err.message })
    }
}