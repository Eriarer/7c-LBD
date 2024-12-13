import express from 'express'
import { validateSchema } from '../middleware/validateSchema.middleware.js'
import {
    addPrestamo,
    getPrestamos,
    getPrestamoById,
    deletePrestamo,
} from '../controllers/prestamo.controller.js'

const router = express.Router()

router.post('/create', validateSchema, addPrestamo)

router.get('/get', getPrestamos)
router.get('/get/:id', getPrestamoById)

router.delete('/delete/:id', deletePrestamo)

export default router