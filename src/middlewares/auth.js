const jwt = require('jsonwebtoken')
const { isValidObjectId } = require('mongoose')
const userModel = require('../models/userModel')

const authentication = (req,res,next)=>{
    try {
        let token = req.headers['authorization']

        if(!token){
            return res.status(400).send({status: false, message: "Token not present"})
        }

        token = token.split(" ")

        console.log(token[1])

        jwt.verify(token[1],'project5',function(err, decoded){
            if(err) return res.status(401).send({status: false, message: err.message}) 
            
           else {
            req.userId = decoded.userId
            next()
        }
        })             
    } catch (error) {
       return res.status(500).send({status: false, message: error.message})
    }
}

const authorization = async (req,res,next)=>{
    try {
        let tokenId = req.userId
        let paramUserId = req.params.userId

        if(paramUserId){
            if(!isValidObjectId(paramUserId)){
                return res.status(400).send({status: false, message: "invalid user id"})
            }
            let userData = await userModel.findById(paramUserId)
            if(!userData){
                return res.status(404).send({status: false, message: "No user found for this UserId"})
            }

            if(paramUserId != tokenId){
                return res.status(403).send({status: false, message: "Unauthorised User Access"})
            }
        }
        next()

    } catch (error) {
        return res.status(500).send({status: false, message: error.message})
    }
}

module.exports = {authentication, authorization}