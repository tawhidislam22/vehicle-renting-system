import { Request, Response } from "express";
import { userService } from "./user.service";


const getAllUsers=async (req:Request,res:Response)=>{
    try{
        const result= await userService.getAllUsers();
        return res.status(200).json({
            success:true,
            message:'Users fetched successfully',
            data:result.rows
        });
    }catch(error){
        return res.status(500).json({
            success:false,
            message:'failed to fetch users'
        })
    }

}

const updateUser=async (req:Request,res:Response)=>{
    try{
        const id=req.params.id;
        const payload=req.body;
        const result= await userService.updateUser(id as string,payload);
        return res.status(200).json({
            success:true,
            message:'User updated successfully',
            data:result.rows[0]
        });
    }catch(error){
        return res.status(500).json({
            success:false,
            message:'failed to update user'
        })
    }
}

const deleteUser=async (req:Request,res:Response)=>{
    try{
        const id=req.params.id;
        const result= await userService.deleteUser(id as string);
        return res.status(200).json({
            success:true,
            message:'User deleted successfully',
            data:result.rows[0]
        });
    }catch(error){
        return res.status(500).json({
            success:false,
            message:'failed to delete user'
        })
    }   
}

export const userController={
    getAllUsers,
    updateUser,
    deleteUser
};