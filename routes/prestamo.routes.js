import express from 'express'
import { validateSchema } from '../middleware/validateSchema.middleware.js'
import {
  addPrestamo,
  getPrestamos,
  getPrestamoById,
  getPrestamoByIdUsuario,
  deletePrestamo,
  updatePrestamo
} from '../controllers/prestamo.controller.js'

const router = express.Router()

router.post('/create', addPrestamo)

router.get('/get', getPrestamos)
router.get('/get/prestamo/:id', getPrestamoById)
router.get('/get/usuario/:idusuario', getPrestamoByIdUsuario)

router.delete('/delete/:id/:estado', deletePrestamo)

router.put('/update/:id', updatePrestamo)

export default router
