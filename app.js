import express from 'express'
import cors from 'cors'
import swaggerUi from 'swagger-ui-express'
import morgan from 'morgan'
import equipo from './routes/equipo.routes.js'
import horario_profesoresRoutes from './routes/horario_profesores.routes.js'
import horario_servicioRoutes from './routes/horario_servicio.routes.js'
import inventarioRoutes from './routes/inventario.routes.js'
import lab_resRoutes from './routes/lab_res.routes.js'
import laboratorioRoutes from './routes/laboratorio.routes.js'
import materialRoutes from './routes/material.routes.js'
import prestamoRoutes from './routes/prestamo.routes.js'
import usuarioRoutes from './routes/usuario.routes.js'
import authRoutes from './routes/auth.routes.js'
import swaggerSpec from './swagger.js'

const app = express()

app.use(cors())
app.use(express.json())
app.use(morgan('dev'))
app.use(express.urlencoded({ extended: true }))

app.use('/equipo', equipo)
app.use('/horarioProfesores', horario_profesoresRoutes)
app.use('/horarioServicio', horario_servicioRoutes)
app.use('/inventario', inventarioRoutes)
app.use('/lab_res', lab_resRoutes)
app.use('/laboratorio', laboratorioRoutes)
app.use('/material', materialRoutes)
app.use('/prestamo', prestamoRoutes)
app.use('/usuario', usuarioRoutes)
app.use('/auth', authRoutes)

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))
app.get('/', (req, res) => {
  res.status(404).json({ status: 'error', message: 'Ruta no encontrada' })
})

export default app
