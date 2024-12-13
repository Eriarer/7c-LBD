import express from 'express'
import { validateSchema } from '../middleware/validateSchema.middleware.js'
import {
    addHorarioServicio,
    getHorariosServicios,
    getHorarioServicioById,
    deleteHorarioServicio
} from '../controllers/horario_servicio.controller.js'

const router = express.Router()

router.post('/create', validateSchema, addHorarioServicio)

router.get('/get', getHorariosServicios)
router.get('/get/:idlaboratorio/:hora_inicio/:hora_cierre/:dias', getHorarioServicioById)

router.delete('/delete/:idlaboratorio/:hora_inicio/:hora_cierre/:dias', deleteHorarioServicio)

export default router