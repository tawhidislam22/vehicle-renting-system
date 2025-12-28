import { NextFunction, Request, Response } from "express"
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from "../config";
import { pool } from "../config/db";


const auth=(...roles:('admin'|'customer')[])=>{
    return async(req:Request,res:Response,next:NextFunction)=>{
        const authHeader = req.headers.authorization;
        
        if(!authHeader || !authHeader.startsWith('Bearer ')){
            return res.status(401).json({
                success:false,
                message:'Unauthorized: No token provided'
            });
        }

        const token = authHeader.substring(7);

        try {
            const decoded=jwt.verify(token,config.secretKey as string) as JwtPayload;

            const user= await pool.query(`
                SELECT * FROM users WHERE email=$1
            `,[decoded.email]);

            if(user.rows.length===0){
                return res.status(401).json({
                    success:false,
                    message:'Unauthorized: User not found'
                });
            }
            req.user=decoded;

            if(roles.length && !roles.includes(user.rows[0].role)){
                return res.status(403).json({
                    success:false,
                    message:'Forbidden: Insufficient permissions'
                });
            }

            next();
        } catch (error) {
            return res.status(401).json({
                success:false,
                message:'Unauthorized: Invalid token'
            });
        }
    }
}

export default auth;