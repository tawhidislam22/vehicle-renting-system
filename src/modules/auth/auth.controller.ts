import { Request, Response } from "express";
import { authService } from "./auth.service";


const signupUser=async(req:Request,res:Response)=>{
    try{
        const result= await authService.signupUser(req.body);
        return res.status(201).json({
            success:true,
            message:'User signed up successfully',
            data:result
        });
    }catch(error){
        return res.status(500).json({
            success:false,
            message:'failed to signup user'
        })
    }
}

const loginUser=async(req:Request,res:Response)=>{
    try{
        const result= await authService.loginUser(req.body.email as string, req.body.password as string);
        return res.status(200).json({
            success:true,
            message:'User logged in successfully',
            data:result
        });
    }catch(error){
        return res.status(500).json({
            success:false,
            message:'failed to login user'
        })
    }
    
}    

export const authController={
    signupUser,
    loginUser
};