import express from 'express'
import { validateSchema } from '../middleware/validateSchema.middleware.js'
import {
  addUsuarioSchema,
  updateUsuarioSchema
} from '../schema/usuario.schema.js'
import {
  addUsuario,
  deleteUsuario,
  updateUsuario,
  getUsuarios,
  getUsuarioById
} from '../controllers/usuario.controller.js'

const router = express.Router()

router.post('/create', validateSchema(addUsuarioSchema), addUsuario)

router.delete('/delete/:id', deleteUsuario)

router.patch('/update/:id', validateSchema(updateUsuarioSchema), updateUsuario)

router.get('/find', getUsuarios)

router.get('/find/:id', getUsuarioById)

export default router
