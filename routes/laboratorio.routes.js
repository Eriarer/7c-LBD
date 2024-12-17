import express from 'express'
import { validateSchema } from '../middleware/validateSchema.middleware.js'
import {
  addLaboratorioSchema,
  updateLaboratorioSchema
} from '../schema/laboratorio.schema.js'
import {
  addLaboratorio,
  getLaboratorios,
  getLaboratorioById,
  deleteLaboratorio,
  updateLaboratorio,
  getHorario
} from '../controllers/laboratorio.controller.js'

const router = express.Router()

router.post('/create', validateSchema(addLaboratorioSchema), addLaboratorio)

router.get('/get', getLaboratorios)
router.get('/get/:id', getLaboratorioById)

router.delete('/delete/:id', deleteLaboratorio)

router.put(
  '/update/:id',
  validateSchema(updateLaboratorioSchema),
  updateLaboratorio
)

//BOrrador porque quiero recibir 2 datos: idLaboratorio y fecha
router.get('/gethorario/:id/:fecha', getHorario)

export default router
