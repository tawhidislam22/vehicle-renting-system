import { Request, Response } from "express";
import { userService } from "./user.service";


const getAllUsers=async (req:Request,res:Response)=>{
    try{
        const result= await userService.getAllUsers();
        return res.status(200).json({
            success:true,
            message:"Users retrieved successfully",
            data:result
        });
    }catch(error:any){
        return res.status(500).json({
            success:false,
            message:'failed to fetch users',
            error: error.message
        })
    }

}

const updateUser=async (req:Request,res:Response)=>{
    try{
        const id=req.params.userId;
        const token=req.headers.authorization;
        const payload=req.body;
        const result= await userService.updateUser(id as string,token as string,payload);
        return res.status(200).json({
            success:true,
            message:"User updated successfully",
            data:result.rows[0]
        });
    }catch(error:any){
        return res.status(500).json({
            success:false,
            message:'failed to update user',
            error: error.message
        })
    }
}

const deleteUser=async (req:Request,res:Response)=>{
    try{
        const id=req.params.userId;
        const result= await userService.deleteUser(id as string);
        return res.status(200).json({
            success:true,
            message:'User deleted successfully'
        });
    }catch(error:any){
        return res.status(500).json({
            success:false,
            message:'failed to delete user',
            error: error.message
        })
    }   
}

export const userController={
    getAllUsers,
    updateUser,
    deleteUser
};