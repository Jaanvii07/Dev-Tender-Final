const mongoose = require("mongoose")

const connectionRequestSchema=new mongoose.Schema(
    {
        fromUserId:{
              type:mongoose.Schema.Types.ObjectId,
              ref:"User",
              required:true,
        },
        toUserId:{
             type:mongoose.Schema.Types.ObjectId,
             ref:"User",
             required:true, 
        },
        status:{
            type:String,
            required:true,
            enum:{
                values:["ignore" , "accepted" , "rejected" , "interested"],
                message:`{VALUE} is incorrect status type`
            },
        },
    },
    {timestamps:true},
);

// Prevent duplicate requests in the same direction
connectionRequestSchema.index({fromUserId:1 , toUserId:1}, { unique: true });

const ConnectionRequest=new mongoose.model("connectionRequest"  , connectionRequestSchema);

module.exports=ConnectionRequest ;