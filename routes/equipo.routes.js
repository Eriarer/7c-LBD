import express from 'express'
import { addEquipoSchema, updateEquipoSchema } from '../schema/equipo.schema.js'
import { validateSchema } from '../middleware/validateSchema.middleware.js'
import {
  addEquipo,
  getEquipos,
  getEquipoById,
  deleteEquipo,
  updateEquipo
} from '../controllers/equipo.controller.js'

const router = express.Router()

router.post('/create', validateSchema(addEquipoSchema), addEquipo)

router.get('/get', getEquipos)
router.get('/get/:id', getEquipoById)

router.delete('/delete/:id', deleteEquipo)

router.put('/update/:id', validateSchema(updateEquipoSchema), updateEquipo)

export default router
