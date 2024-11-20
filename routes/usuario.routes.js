import express from 'express'
import { validateSchema } from '../middleware/validateSchema.middleware.js'
import { addUsuarioSchema } from '../schema/usuario.schema.js'
import {
  addUsuario,
  deleteUsuario,
  deleteUsuarios,
  updateUsuario,
  getUsuarios,
  getUsuariosFiltered,
  getUsuarioById
} from '../controllers/usuario.controller.js'

const router = express.Router()

router.post('/', validateSchema(addUsuarioSchema), addUsuario)

router.delete('/:id', deleteUsuario)
router.delete('/', deleteUsuarios)

router.patch('/:id', updateUsuario)

router.get('/find', getUsuarios)
router.get('/query', getUsuariosFiltered)
router.get('/:id', getUsuarioById)

export default router
