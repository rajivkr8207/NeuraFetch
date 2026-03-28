import express from 'express'
import morgan from 'morgan'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import ItemRouter from './routes/item.routes.js'
import authrouter from './routes/auth.route.js'
import { errorHandler, notFound } from './middleware/error.middleware.js'
const app = express()

app.use(express.json())
app.use(morgan('dev'))
app.use(cookieParser())

app.use(cors({
  origin: ["http://localhost:5174", "http://127.0.0.1:5174"],
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.urlencoded({ extended: true }))
app.use(express.static('./public/frontend'))


app.get('/health', (req, res) => {
  res.send('Server is healthy');
})


app.use('/api/auth', authrouter)
app.use('/api/items', ItemRouter)


app.use(errorHandler)
app.use(notFound)
export default app;