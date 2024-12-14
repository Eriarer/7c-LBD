import express from 'express'
import { validateSchema } from '../middleware/validateSchema.middleware.js'
import {
  addHorarioServicioSchema,
  updateHorarioServicioSchema
} from '../schema/horario_servicio.schema.js'
import {
  addHorarioServicio,
  getHorariosServicios,
  getHorarioServicioById,
  deleteHorarioServicio,
  updateHorarioServicio
} from '../controllers/horario_servicio.controller.js'

const router = express.Router()

router.post(
  '/create',
  validateSchema(addHorarioServicioSchema),
  addHorarioServicio
)

router.get('/get', getHorariosServicios)
router.get('/get/:id', getHorarioServicioById)

router.delete('/delete/:id', deleteHorarioServicio)

router.put(
  '/update/:id',
  validateSchema(updateHorarioServicioSchema),
  updateHorarioServicio
)

export default router
