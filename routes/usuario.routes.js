import express from 'express'
import { validateSchema } from '../middleware/validateSchema.middleware.js'
import { addUsuarioSchema } from '../schema/usuario.schema.js'
import { addUsuario, deleteUsuario, deleteUsuarios, updateUsuario, getUsuarios, getUsuariosFiltered, getUsuarioById } from "../controllers/usuario.controller.js"

const router = express.Router()

router.post('/usuario', validateSchema(addUsuarioSchema), addUsuario)

router.delete('/usuario/:id', deleteUsuario)
router.delete('/usuarios', deleteUsuarios)

router.patch('/usuario/:id', updateUsuario)

router.get('/usuarios', getUsuarios)
router.get('/usuarios/filtered', getUsuariosFiltered)
router.get('/usuario/:id', getUsuarioById)

export default router