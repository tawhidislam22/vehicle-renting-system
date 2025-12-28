import { Request, Response } from "express";
import { bookingService } from "./booking.service";


const addNewBooking= async (req:Request, res:Response) => {
    try {
        const payload = req.body;
        const result = await bookingService.addNewBooking(payload);
        res.status(201).json({
            message: "Bookings retrieved successfully",
            data: result.rows[0]
        });
    } catch (error:any) {
        res.status(500).json({
            message: 'Internal server error',
            error: error.message
        });
    }

};

const getBooking= async (req:Request, res:Response) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader?.substring(7); 
        
        const result = await bookingService.getBooking(token as string);
        res.status(200).json({
            message: 'Bookings retrieved successfully',
            data: result
        });
    } catch (error:any) {
        res.status(500).json({
            message: 'Internal server error',
            error: error.message
        });
    }
};

const updateBooking= async (req:Request, res:Response) => {
    try {
        const id=req.params.bookingId; 
        const status=req.body?.status;
        const authHeader = req.headers.authorization;
        const token = authHeader?.substring(7); 
        
        const result = await bookingService.updateBooking(id as string,status as string,token as string);
        res.status(200).json({
            success:true,
            message: result.message,
            data: result.data
        });
    } catch (error:any) {
        res.status(500).json({
            success:false,
            message: 'Internal server error',
            error: error.message
        });
    }
};

export const bookingController = {
    addNewBooking,
    getBooking,
    updateBooking
};