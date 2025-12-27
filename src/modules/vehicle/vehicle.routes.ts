import express from 'express';
import { vehicleController } from './vehicle.controller';

const router= express.Router();

router.post('/', vehicleController.addNewVehicle)

router.get('/', vehicleController.getAllVehicles)

router.get('/:vehicleId', vehicleController.getVehicleById)

export const vehicleRoutes= router;