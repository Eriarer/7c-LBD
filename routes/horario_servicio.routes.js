import express from 'express'
import { validateSchema } from '../middleware/validateSchema.middleware.js'
import {
  addHorarioServicio,
  getHorariosServicios,
  getHorarioServicioById,
  deleteHorarioServicio,
  updateHorarioServicio
} from '../controllers/horario_servicio.controller.js'

const router = express.Router()

router.post('/create', validateSchema, addHorarioServicio)

router.get('/get', getHorariosServicios)
router.get('/get/:id', getHorarioServicioById)

router.delete('/delete/:id', deleteHorarioServicio)

router.put('/update/:id', validateSchema, updateHorarioServicio)

export default router
