import { Request, Response } from "express";
import { vehicleService } from "./vehicle.service";

const addNewVehicle=async(req:Request,res:Response)=>{
    try {
        const payload= req.body;   
        const result= await vehicleService.addNewVehicle(payload);
        res.status(201).json({
            message:'Vehicle added successfully',
            data:result.rows[0]
        });
    }catch (error:any) {
        res.status(500).json({
            message:'Internal server error',
            error:error.message
        });
    }
}


const getAllVehicles=async(req:Request,res:Response)=>{
    try {
        const result= await vehicleService.getAllVehicles();    

        res.status(200).json({
            message:'Vehicles fetched successfully',
            data:result.rows
        });
    }catch (error:any) {
        res.status(500).json({
            message:'Internal server error',
            error:error.message
        });
    }
}   

const getVehicleById=async(req:Request,res:Response)=>{
    try {
        const {vehicleId}= req.params;
        const result= await vehicleService.getVehicleById(vehicleId as string);  
        if(result.rows.length===0){
            return res.status(404).json({
                message:'Vehicle not found'
            });
        }
        res.status(200).json({
            message:'Vehicle fetched successfully',
            data:result.rows[0]
        });
    }catch (error:any) {
        res.status(500).json({
            message:'Internal server error',
            error:error.message
        });
    }
}

export const vehicleController={
    addNewVehicle,
    getAllVehicles,
    getVehicleById
}