import express from 'express';
import { vehicleController } from './vehicle.controller';
import auth from '../../middleware/auth';
import { Roles } from '../auth/auth.constant';

const router= express.Router();

router.post('/',auth(Roles.ADMIN), vehicleController.addNewVehicle)

router.get('/', vehicleController.getAllVehicles)

router.get('/:vehicleId', vehicleController.getVehicleById)

router.put('/:vehicleId',auth(Roles.ADMIN), vehicleController.updateVehicle)

router.delete('/:vehicleId',auth(Roles.ADMIN), vehicleController.deleteVehicle)

export const vehicleRoutes= router;