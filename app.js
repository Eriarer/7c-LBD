import express from 'express'
import swaggerUi from 'swagger-ui-express'
import morgan from 'morgan'
import usuarioRoutes from './routes/usuario.routes.js'
import responsableRoutes from './routes/responsable.routes.js'
import swaggerSpec from './swagger.js'

const app = express()

app.use(express.json())
app.use(morgan('dev'))
app.use(express.urlencoded({ extended: true }))

app.use('/usuario', usuarioRoutes)
app.use('/responsable', responsableRoutes)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))
app.get('/', (req, res) => {
  res.redirect('/api-docs')
})

export default app
