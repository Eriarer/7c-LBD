import express from 'express'
import { validateSchema } from '../middleware/validateSchema.middleware.js'
import {
  addResponsableSchema,
  updateResponsableSchema
} from '../schema/responsable.shcema.js'
import {
  addResponsable,
  getResponsables,
  getResponsableById,
  updateResponsable,
  deleteResponsable
} from '../controllers/responsable.controller.js'

const router = express.Router()

router.post('/create', validateSchema(addResponsableSchema), addResponsable)

router.get('/get', getResponsables)
router.get('/get/:id', getResponsableById)

router.put(
  '/update/:id',
  validateSchema(updateResponsableSchema),
  updateResponsable
)

router.delete('/delete/:id', deleteResponsable)

export default router
