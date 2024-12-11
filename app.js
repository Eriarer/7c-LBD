import express from 'express'
import usuarioRoutes from './routes/usuario.routes.js'
import responsableRoutes from './routes/responsable.routes.js'

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/usuario', usuarioRoutes)
app.use('/responsable', responsableRoutes)

export default app
