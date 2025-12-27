import { Request, Response } from "express";
import { bookingService } from "./booking.service";


const addNewBooking= async (req:Request, res:Response) => {
    try {
        const payload = req.body;
        const result = await bookingService.addNewBooking(payload);
        res.status(201).json({
            message: 'Booking created successfully',
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
        const token=req.headers.authorization;
        
        const result = await bookingService.getBooking(token as string);
        res.status(200).json({
            message: 'Bookings retrieved successfully',
            data: result.rows
        });
    } catch (error:any) {
        res.status(500).json({
            message: 'Internal server error',
            error: error.message
        });
    }
};

export const bookingController = {
    addNewBooking,
    getBooking
};