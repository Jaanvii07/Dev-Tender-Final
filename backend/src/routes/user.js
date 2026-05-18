const express = require('express');
const { userAuth } = require('../middleware/auth');
const ConnectionRequest = require('../models/connectionRequest');
const User = require('../models/user');
const userRouter = express.Router();

userRouter.get('/user/request/review' , userAuth , async(req,res)=>{
    try {
        const loggedInUser=req.user;
        const connectionRequest=await ConnectionRequest.find({
            toUserId:loggedInUser._id,
            status:"interested"
        }).populate("fromUserId" , "firstName lastName email skills photoUrl description age gender ");
        res.status(200).json({connectionRequest});
    } catch (error) {
        console.error('Error fetching user request reviews:', error);
        res.status(500).send("Error fetching user request reviews");
    }
});

userRouter.get('/user/connections' , userAuth , async(req,res)=>{
    try {
        const loggedInUser=req.user;
        const connections=await ConnectionRequest.find({
            $or:[
                {fromUserId:loggedInUser._id , status:"accepted"},
                {toUserId:loggedInUser._id , status:"accepted"}
            ]
        }).populate("fromUserId" , "firstName lastName skills photoUrl description age gender")
           .populate("toUserId" , "firstName lastName skills photoUrl description age gender");

        const data = connections.map((row) => {
            if (row.fromUserId._id.toString() === loggedInUser._id.toString()) {
                return row.toUserId;
            }
            return row.fromUserId;
        });
        res.status(200).json({data});
    } catch (error) {
        console.error('Error fetching user connections:', error);
        res.status(500).send("Error fetching user connections");
    } 
});

userRouter.get('/feed', userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;

        const page = parseInt(req.query.page) || 1;

        let limit = parseInt(req.query.limit) || 10;
        limit = limit > 50 ? 50 : limit;

        const skip = (page - 1) * limit;

        // Find all connection requests (sent or received)
        const connectionRequests = await ConnectionRequest.find({
            $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }]
        }).select("fromUserId toUserId");

        const hiddenUsersFromFeed = new Set();
        connectionRequests.forEach((req) => {
            hiddenUsersFromFeed.add(req.fromUserId.toString());
            hiddenUsersFromFeed.add(req.toUserId.toString());
        });

        const hiddenUsersArray = Array.from(hiddenUsersFromFeed);

        const user = await User.find({
            $and: [
                { _id: { $nin: hiddenUsersArray } },
                { _id: { $ne: loggedInUser._id } }
            ]
        })
        .select("firstName lastName age gender description skills photoUrl")
        .skip(skip)
        .limit(limit);

        res.status(200).json({ user });

    } catch (error) {
        console.error('Error fetching user feed:', error);
        res.status(500).send("Error fetching user feed");
    }
});

module.exports = userRouter;