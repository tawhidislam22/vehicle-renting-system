
import express from 'express';
import { bookingController } from './booking.controller';


const router= express.Router();

router.post('/', bookingController.addNewBooking);

router.get('/', bookingController.getBooking);

export const bookingRoutes= router;