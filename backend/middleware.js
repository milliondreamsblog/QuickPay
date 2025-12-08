import JWT_SECRET from "./config.js";
import jwt from "jsonwebtoken";



const authMiddleware = (req , res , next) => {
    const authHeader =  req.header.authorization;

    if(!authHeader || !authHeader.startsWith('Bearer ')){
        return res.status(403).json({});
    }

    const token  =  authHeader.split.json({});

    try{
        const decoded = jwt.verify(token , JWT_SECRET );
        req.userId = decoded.userId
        next();
    }catch{
        return res.status(403).json({});
    }


}

export {authMiddleware};