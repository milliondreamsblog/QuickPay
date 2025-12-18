import JWT_SECRET from "./config.js";
import jwt from "jsonwebtoken";



const authMiddleware = (req , res , next) => {
    console.log("Auth Header:", req.headers.authorization);
    const authHeader =  req.headers.authorization;
   


    if(!authHeader || !authHeader.startsWith('Bearer ')){
        return res.status(403).json({});
    }

    const token  =  authHeader.split(" ")[1];

    try{
        const decoded = jwt.verify(token , JWT_SECRET );
        req.userId = decoded.userId
        next();
    }catch{
        return res.status(403).json({});
    }


}

export {authMiddleware};