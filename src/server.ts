import express, { Request, Response } from 'express'
import config from './config'
import { authRoutes } from './modules/auth/auth.routes'
import { userRoutes } from './modules/user/user.routes'
import { bookingRoutes } from './modules/booking/booking.routes'
import { vehicleRoutes } from './modules/vehicle/vehicle.routes'
import initDb from './config/db'
const app = express()
app.use(express.json());

const port = config.port


app.get('/', (req:Request, res:Response) => {
  res.send('Hello World!')
})

//database initialization

initDb();

app.use('/api/v1/auth',authRoutes)

app.use('/api/v1/users',userRoutes);

app.use('/api/v1/vehicles',vehicleRoutes)

app.use('/api/v1/bookings',bookingRoutes);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
