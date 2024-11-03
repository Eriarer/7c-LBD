import express from 'express'
import usuarioRoutes from './routes/usuario.routes.js'

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/glem', usuarioRoutes)

export default app
