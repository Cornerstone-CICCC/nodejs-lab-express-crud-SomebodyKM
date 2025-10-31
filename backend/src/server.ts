import express, { Request, Response, NextFunction } from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
dotenv.config()
import employeeRouter from './routes/employees.routes'

const app = express()

app.use(express.json())
app.use(cors())

app.use("/employees", employeeRouter)

app.use((req: Request, res: Response, next: NextFunction) => {
    res.status(404).send("Invalid route")
})

const PORT = process.env.PORT || 4000
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
})