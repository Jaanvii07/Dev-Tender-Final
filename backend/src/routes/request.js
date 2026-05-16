const express = require('express');
const mongoose = require('mongoose');
const { userAuth } = require('../middleware/auth');
const ConnectionRequest = require('../models/connectionRequest');
const User = require("../models/user.js");
const reqestRouter = express.Router();

reqestRouter.post(
  '/request/send/:status/:toUserId',
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req.user._id;
      const { toUserId: toUserIdParam, status } = req.params;

      // Validate ObjectId
      if (!mongoose.Types.ObjectId.isValid(toUserIdParam)) {
        return res.status(400).json({ message: 'Invalid toUserId' });
      }

      const toUserId = new mongoose.Types.ObjectId(toUserIdParam);

      // Prevent sending request to yourself
      if (fromUserId.toString() === toUserId.toString()) {
        return res
          .status(400)
          .json({ message: 'You cannot send request to yourself' });
      }

      const allowedStatus = ['ignore', 'interested'];

      if (!allowedStatus.includes(status)) {
        return res.status(400).json({ message: 'Invalid status type' });
      }

      const toUser = await User.findOne({ _id: toUserId });

      if (!toUser) {
        return res.status(404).json({ message: 'User not found' });
      }

      const existingConnectionRequest =
        await ConnectionRequest.findOne({
          $or: [
            { fromUserId, toUserId },
            { fromUserId: toUserId, toUserId: fromUserId },
          ],
          status: { $ne: 'rejected' },
        });

      if (existingConnectionRequest) {
        return res
          .status(400)
          .json({ message: 'Connection request already exists' });
      }

      const connectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });

      await connectionRequest.save();

      res.status(200).json({
        message: 'Connection request sent successfully',
      });
    } catch (error) {
      console.error('Error sending connection request:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
);

reqestRouter.post('/request/review/:status/:requestId'  , userAuth , async(req,res)=>{
    try {
        const loggedInUser=req.user;
        const { requestId } = req.params; 
        const status=req.params.status;
         const allowedStatus=["accepted" , "rejected"];
        if(!allowedStatus.includes(status)){
            return res.status(400).json({message:"Invalid status type"});
        }
        
        const connectionRequest=await ConnectionRequest.findOne({
            _id:requestId,
            toUserId:loggedInUser._id,
            status:"interested"
        });
         
        if(!connectionRequest){
            return res
                .status(404)
                .json({message:"Connection Request not found"});
        }

        connectionRequest.status = status;
        await connectionRequest.save();
         res.status(200).json({message:`Connection request ${status} successfully`});
    } catch (error) {
         console.log(error);
         res.status(500).json({message:"Internal server error"});
    }
});

module.exports = reqestRouter; 