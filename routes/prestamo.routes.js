import express from 'express'
import { validateSchema } from '../middleware/validateSchema.middleware.js'
import {
  addPrestamo,
  getPrestamos,
  getPrestamoById,
  deletePrestamo,
  updatePrestamo
} from '../controllers/prestamo.controller.js'

const router = express.Router()

router.post('/create', addPrestamo)

router.get('/get', getPrestamos)
router.get('/get/:id', getPrestamoById)

router.delete('/delete/:id/:estado', deletePrestamo)

router.put('/update/:id', updatePrestamo)

export default router
