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
  updateLaboratorio
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

export default router
