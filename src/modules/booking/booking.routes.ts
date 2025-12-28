
import express from 'express';
import { bookingController } from './booking.controller';
import auth from '../../middleware/auth';
import { Roles } from '../auth/auth.constant';


const router= express.Router();

router.post('/',auth(Roles.ADMIN,Roles.CUSTOMER), bookingController.addNewBooking);

router.get('/',auth(Roles.ADMIN,Roles.CUSTOMER), bookingController.getBooking);

router.put('/:bookingId',auth(Roles.ADMIN,Roles.CUSTOMER), bookingController.updateBooking);
export const bookingRoutes= router;