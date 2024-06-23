import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import { corsConfig } from "./config/cors"
import { connectDB } from "./config/db"
import projectRoutes from "./routes/projectRoutes"
import authRoutes from "./routes/authRoutes"
import morgan from "morgan"

dotenv.config()
connectDB()

const app = express()
app.use(cors(corsConfig))

// TODO:LOGGING
app.use(morgan("dev"))

// TODO: LEER DATOS DE FORMULARIOS
app.use(express.json())

//ROUTES
app.use("/api/auth", authRoutes )
app.use("/api/projects", projectRoutes )

export default app

//instalar bcrypt otra vez