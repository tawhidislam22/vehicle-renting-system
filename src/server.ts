import express, { Request, Response } from 'express'
import config from './config'
import { authRoutes } from './modules/auth/auth.routes'
import { userRoutes } from './modules/user/user.routes'
const app = express()
const port = config.port

app.get('/', (req:Request, res:Response) => {
  res.send('Hello World!')
})

app.use('/api/v1/auth',authRoutes)

app.use('/api/v1/users',userRoutes);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
