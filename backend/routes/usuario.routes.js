import express from 'express'
import { addUsuario, deleteUsuario, deleteUsuarios, updateUsuario, getUsuarios, getUsuarioById } from "../controllers/usuario.controller.js"

const router = express.Router()

router.post('/usuario', addUsuario)

router.delete('/usuario/:id', deleteUsuario)
router.delete('/usuarios', deleteUsuarios)

router.patch('/usuario/:id', updateUsuario)

router.get('/usuarios', getUsuarios)
router.get('/usuario/:id', getUsuarioById)

export default router