import express from 'express'
import { validateSchema } from '../middleware/validateSchema.middleware.js'
import {
  addUsuarioSchema,
  updateUsuarioSchema,
  updatePasswordSchema
} from '../schema/usuario.schema.js'
import {
  addUsuario,
  deleteUsuario,
  updateUsuario,
  getUsuarios,
  getUsuarioById,
  updatePassword
} from '../controllers/usuario.controller.js'

const router = express.Router()

router.post('/create', validateSchema(addUsuarioSchema), addUsuario)

router.delete('/delete/:id', deleteUsuario)

router.post('/update/:id', validateSchema(updateUsuarioSchema), updateUsuario)
router.post(
  '/update/password/:id',
  validateSchema(updatePasswordSchema),
  updatePassword
)

router.get('/get', getUsuarios)

router.get('/get/:id', getUsuarioById)

export default router
