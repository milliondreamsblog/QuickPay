import express from 'express';
import  jwt  from 'jsonwebtoken';
import mongoose from "mongoose";
import { accountModel } from "../db";
import { authMiddleware } from "../middleware";

const app = express();

const router = express.Router();

router.get("/balance", authMiddleware, async (req, res) => {
  try {
    // If middleware failed to set userId
    if (!req.userId) {
      return res.status(400).json({
        message: "Your account does not exist",
      });
    }

    const account = await accountModel.findOne({ userId: req.userId });

    // If no account found
    if (!account) {
      return res.status(404).json({
        message: "Account not found",
      });
    }

    return res.status(200).json({
      balance: account.balance,
    });
  } catch (error) {
    console.error("Error fetching balance:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
});

router.post("/transfer" , authMiddleware , async (req, res) => {
    let session;
    try{
        //Transaction stabiles 
        session  =  await mongoose.startSession();

        //start the session 
        session.startTransaction();

        //read details
        const {to , amount} =  req.body;

        //check i I have money or not
        const account  = await accountModel.findOne({
            userId : req.userId
        }).session(session);

        if(!account || account.balance < amount){
            await session.abortTransaction();
            return res.status(400).json({
                message : "Insufficient funds"
            })
        }

        const accountTo  = await accountModel.findOne({
            userId : to
        }).session(session)

        if(!accountTo){
            await session.abortTransaction();
            return res.status(400).json({
                message : "user account does not exist"
            })
        }

        await accountModel.updateOne(
            {
                userId : req.userId
            },
            {
                $inc : {balance : -amount}
            }).session(session);

        await accountModel.updateOne(
            {
                userId : to
            },
            {
                $inc : {balance : amount}
            }).session(session)


        await session.commitTransaction();
        session.endSession();

        res.json({
            message:"Transaction successfull"
        })

    }catch(error){
        console.error("Transfer Error:", error);
        if (session) {
            await session.abortTransaction();
            session.endSession();
        }
        return res.status(500).json({ message: "Internal server error" });
    }
})


export default router;