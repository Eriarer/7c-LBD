import express from 'express'
import { validateSchema } from '../middleware/validateSchema.middleware.js'
import {
  addPrestamoSchema,
  updatePrestamoSchema
} from '../schema/prestamo.schema.js'
import {
  addPrestamo,
  getPrestamos,
  getPrestamoById,
  getPrestamoByIdUsuario,
  deletePrestamo,
  updatePrestamo
} from '../controllers/prestamo.controller.js'

const router = express.Router()

router.post('/create', validateSchema(addPrestamoSchema), addPrestamo)

router.get('/get', getPrestamos)
router.get('/get/prestamo/:id', getPrestamoById)
router.get('/get/usuario/:idusuario', getPrestamoByIdUsuario)

router.delete('/delete/:id/:estado', deletePrestamo)

router.put('/update/:id', validateSchema(updatePrestamoSchema), updatePrestamo)

export default router
