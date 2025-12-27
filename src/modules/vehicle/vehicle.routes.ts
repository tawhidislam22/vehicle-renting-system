import express from 'express';
import { vehicleController } from './vehicle.controller';

const router= express.Router();

router.post('/', vehicleController.addNewVehicle)

router.get('/', vehicleController.getAllVehicles)

router.get('/:vehicleId', vehicleController.getVehicleById)

router.put('/:vehicleId', vehicleController.updateVehicle)

router.delete('/:vehicleId', vehicleController.deleteVehicle)

export const vehicleRoutes= router;