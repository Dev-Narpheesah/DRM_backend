const express = require('express');
const expressAsyncHandler = require('express-async-Handler');
const UserInfo = require('../models/UserInfoModel')

const UserInfoRouter = express.Router();


UserInfoRouter.post('/', expressAsyncHandler(async (req, res) => {
    const newUserInfo =  new UserInfo({
        userInfo: req.body.userInfo.map((info) => ({...info, user: info._id})),
        message: req.body.message,
        
    })

    const userInfo = await newUserInfo.save();
    res.status(200).json({message: 'New User Created', userInfo});
}))

UserInfoRouter.get('/user-info', expressAsyncHandler(async (req, res) => {
    const newUserInfo = await UserInfo.findById(req.params._id)
    if (newUserInfo) {
        res.status(200).json(newUserInfo);
      } else {
        res.status(404);
        throw new Error("User not found");
      }
}))

UserInfoRouter.delete('/:_id', expressAsyncHandler(async(req, res) => {
    const userInfo = await UserInfo.findById(req.params.id);
    if (userInfo) {
        await userInfo.deleteOne();
        res.status(200).json({ message: 'User deleted successfully!' });
      } else {
        res.status(404);
        throw new Error("User not found");
      }
}) )