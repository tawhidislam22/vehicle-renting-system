import { Request, Response } from "express";
import { authService } from "./auth.service";


const signupUser=async(req:Request,res:Response)=>{
    try{
        const result= await authService.signupUser(req.body);

        return res.status(201).json({
            success:true,
            message:"User registered successfully",
            data:result.rows[0]
        });
    }catch(error :any){
        return res.status(500).json({
            success:false,
            message:'failed to signup user',
            error: error.message
        })
    }
}

const loginUser=async(req:Request,res:Response)=>{
    try{
        const result= await authService.loginUser(req.body.email as string, req.body.password as string);
        return res.status(200).json({
            success:true,
            message:"Login successful",
            data:result 
        });
    }catch(error:any){
        console.error('Login error:', error.message);
        return res.status(500).json({
            success:false,
            message:'failed to login user',
            error: error.message
        })
    }
    
}    

export const authController={
    signupUser,
    loginUser
};