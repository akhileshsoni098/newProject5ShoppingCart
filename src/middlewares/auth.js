// const saltrounds=10;
//     bcrypt.hash(password, saltrounds ,function(err, hash){
//         if(hash) userData.password=hash;
//         else return res.status(400).send({status:false, message:"please send another password"})
//     })

//     bcrypt.compare(password, isUserExist.password, function(err, matched){
//         if(err) return res.status(400).send({status:false, message:"Please enter valid password"})
//       })


const jwt = require('jsonwebtoken')
const { isValidObjectId } = require('mongoose')
const userModel = require('../models/userModel')

const authentication = function(req,res,next){
    try {
        let token = req.headers.authorization
        if(!token){
            return res.status(404).send({status: false, message: "Token not resent"})
        }
        let decodedToken = jwt.verify(token,'project5')
        if(!decodedToken){
            return res.status(401).send({status: false, message: 'invalid token'})
        }
        req.userId = decodedToken.userId
        next()
    } catch (error) {
        res.status(500).send({status: false, message: error.message})
    }
}


const authorization = async function(req,res,next){
    try {
        let tokenId = req.userId
        let paramUserId = req.params.userId
        if(paramUserId){
            if(!isValidObjectId(paramUserId)){
                return res.status(400).send({status: false, message: "invalid user id"})
            }
            let userData = await userModel.findById(paramUserId)
            if(!userData){
                return res.status(404).send({status: false, message: "No user found"})
            }
            let userId = userData._id
            if(userId != tokenId){
                return res.status(403).send({status: false, message: "Unauthorised user access"})
            }
        }
        next()

    } catch (error) {
         res.status(500).send({status: false, message: error.message})
    }
}

module.exports = {authentication, authorization}