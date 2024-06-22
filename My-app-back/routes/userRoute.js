const express=require('express')
const router=express.Router()
const userController=require('../controller/userController')

router.post("/user/create",userController.createUser)

router.post("/user/read",userController.login)

router.get("/user/get/:token",userController.getUser)

module.exports=router