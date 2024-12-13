import express from 'express'
import { validateSchema } from '../middleware/validateSchema.middleware.js'
import {
    addHorarioProfesor,
    getHorariosProfesores,
    getHorarioProfesorById,
    deleteHorarioProfesor,
    updateHorarioProfesor
} from '../controllers/horario_profesores.controller.js'

const router = express.Router()

router.post('/create', validateSchema, addHorarioProfesor)

router.get('/get', getHorariosProfesores)
router.get('/get/:id', getHorarioProfesorById)

router.delete('/delete/:id', deleteHorarioProfesor)

router.put('/update/:id', validateSchema, updateHorarioProfesor)

export default router