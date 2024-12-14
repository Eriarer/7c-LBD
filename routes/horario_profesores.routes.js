import express from 'express'
import {
  addHorarioProfesoresSchema,
  updateHorarioProfesoresSchema
} from '../schema/horario_profesores.schema.js'
import { validateSchema } from '../middleware/validateSchema.middleware.js'
import {
  addHorarioProfesor,
  getHorariosProfesores,
  getHorarioProfesor,
  deleteHorarioProfesor,
  updateHorarioProfesor
} from '../controllers/horario_profesores.controller.js'

const router = express.Router()

router.post(
  '/create',
  validateSchema(addHorarioProfesoresSchema),
  addHorarioProfesor
)

router.get('/get', getHorariosProfesores)
router.get('/get/:id', getHorarioProfesor)

router.delete('/delete/:id', deleteHorarioProfesor)

router.put(
  '/update/:id',
  validateSchema(updateHorarioProfesoresSchema),
  updateHorarioProfesor
)

export default router
