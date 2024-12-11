import express from 'express'
import { validateSchema } from '../middleware/validateSchema.middleware.js'
import {
    addLaboratorio,
    getLaboratorios,
    getLaboratorioById,
    deleteLaboratorio,
    updateLaboratorio
} from '../controllers/laboratorio.controller.js'

const router = express.Router()

router.post('/create', validateSchema, addLaboratorio)

router.get('/get', getLaboratorios)
router.get('/get/:id', getLaboratorioById)

router.delete('/delete/:id', deleteLaboratorio)

router.put('/update/:id', validateSchema, updateLaboratorio)

export default router