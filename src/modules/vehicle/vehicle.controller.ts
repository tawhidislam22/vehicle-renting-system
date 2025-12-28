import { Request, Response } from "express";
import { vehicleService } from "./vehicle.service";

const addNewVehicle = async (req: Request, res: Response) => {
    try {
        const payload = req.body;
        const result = await vehicleService.addNewVehicle(payload);
        res.status(201).json({
            success:true,
            message: "Vehicle created successfully",
            data: result.rows[0]
        });
    } catch (error: any) {
        res.status(500).json({
            success:false,
            message: 'Internal server error',
            error: error.message
        });
    }
}


const getAllVehicles = async (req: Request, res: Response) => {
    try {
        const result = await vehicleService.getAllVehicles();
        if (result.rows.length === 0) {
            return res.status(200).json({
                success: true,
                message: "No vehicles found",
                data: []
            });
        }
        res.status(200).json({
            success: true,
            message: "Vehicles retrieved successfully",
            data: result.rows
        });
    } catch (error: any) {
        res.status(500).json({
            success:false,
            message: 'Internal server error',
            error: error.message
        });
    }
}

const getVehicleById = async (req: Request, res: Response) => {
    try {
        const { vehicleId } = req.params;
        const result = await vehicleService.getVehicleById(vehicleId as string);
        if (result.rows.length === 0) {
            return res.status(404).json({
                success:false,
                message: 'Vehicle not found'
            });
        }
        res.status(200).json({
            success:true,
            message: "Vehicles retrieved successfully",
            data: result.rows[0]
        });
    } catch (error: any) {
        res.status(500).json({
            success:false,
            message: 'Internal server error',
            error: error.message
        });
    }
}

const updateVehicle = async (req: Request, res: Response) => {
    try {
        const { vehicleId } = req.params;
        const payload = req.body;
        const result = await vehicleService.updateVehicle(vehicleId as string, payload);
        if (result.rows.length === 0) {
            return res.status(404).json({
                success:false,
                message: 'Vehicle not found'
            });
        }
        res.status(200).json({
            success:true,
            message: "Vehicle updated successfully",
            data: result.rows[0]
        });
    } catch (error: any) {
        res.status(500).json({
            success:false,
            message: 'Internal server error',
            error: error.message
        });
    }
}

const deleteVehicle = async (req: Request, res: Response) => {
    try {
        const { vehicleId } = req.params;
        const result = await vehicleService.deleteVehicle(vehicleId as string);
        if (result.rows.length === 0) {
            return res.status(404).json({
                success:false,
                message: 'Vehicle not found'
            });
        }
        res.status(200).json({
            success: true,
            message: "Vehicle deleted successfully"
            
        });
    } catch (error: any) {
        res.status(500).json({
            message: 'Internal server error',
            error: error.message
        });
    }
}

export const vehicleController = {
    addNewVehicle,
    getAllVehicles,
    getVehicleById,
    updateVehicle,
    deleteVehicle
}