import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();  


mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("MongoDB connected successfully!");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });


const Schema = mongoose.Schema;


const userSchema = new Schema({
    username : {
        type : String,
        required : true,
        unique : true,
        trim : true,
        lowercase : true,
        minlength : 3,
        maxlength : 30

    },
    firstname :  {
        type : String,
        required : true,
        maxlength  : 50,

    },
    lastname : {
        type : String,
        required : true,
        trim:  true,
        maxlength : 50,
    },
    password :{
        type :  String,
        required : true,
        lowercase : true,
        trim : true,
        minlength : 3,
        maxlength : 9
    } ,
    email :{
        type : String,
        required : true,
        lowercase : true,
        trim : true,
        maxlength : 30
    }

})

const userModel = mongoose.model("User" ,  userSchema );

const accountSchema = new Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref : 'User',
        required : true
    },
    balance:{
        type : Number,
        required :  true

    }
})

const accountModel =  mongoose.model("Account" ,  accountSchema);


//@ts-ignore
export { userModel  , accountModel};
// module.exports = userModel;