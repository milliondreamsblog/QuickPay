import express from 'express';
import  jwt  from 'jsonwebtoken';
import * as z from "zod"; 
import dotenv from "dotenv";
import { error } from 'console';
import { accountModel, userModel } from "../db.js";
import { authMiddleware } from '../middleware.js';


const app = express();

const  router = express.Router();

 const schema = z.object({
        username : z.string(),
        firstname : z.string(),
        lastname :  z.string(),
        password : z.string(),
        email :  z.string().email(),
    })

router.post('/signup' ,  async (req,res) => {
    const parsad  =  schema.safeParse(req.body);
    if( !parsad.success) {
        return res.status(411).json({
            message: "Email allready exist / Incorrect input",
            error : success.error.errors,
        })
    }

    const existingUser =  await userModel.findOne({
        username : req.body.username
    })

    if(existingUser){
        return res.status(411).json({
            message : "Username already taken"
        })

    }

    const user = await userModel.create({
        username :  req.body.username,
        firstname : req.body.firstname,
        lastname : req.body.lastname,
        password  :  req.body.password,
        email :  req.body.email
    })

    const userId = user._id;

    const initialBalance = 10000;

    const userAccount = await accountModel.create({
        userId: user._id,
        balance: initialBalance
    });

    const token = jwt.sign({
        userId
    },process.env.SECRET_KEY)

    res.json({
        message : "New user signIn has happened",
        token :  token,
        balance: userAccount.balance
    })

} )

router.post('/signin' , (req,res) => {
    console.log("hello")
} )


const updatedUser = {
    username : z.string().optional(),
    firstname : z.string().optional(),
    lastname :  z.string().optional(),
    password : z.string().optional(),
    email :  z.string().email().optional(),
}
router.put('/' , authMiddleware, async (req,res) =>  {
    const {success} = await updatedUser.safeParse(req.body);
    if(!success) {
        res.status(411).json({
            message : "Invaild input "
        })
    }

    const User = User.UpdateOne({
        _id:req.userId,
    }, req.body)

    res.json({
        message:"Update Successfull"
    })
})


//To match the sub string in the data 
router.get("/bulk" , async (req,res) => {
    const  filter = req.query.filter || "";
    const users = await userModel.find({
        $or:[{
            firstname : {
                "$regex":filter
            }
        },{
            lastname : {
                "$regex":filter
            }

        }]
    })

    res.json({
        user:users.map(user => ({
            username: user.username,
            firstname : user.firstname,
            lastname : user.lastname,
            _id : user._id
        }))
    })
})

export default router;