import express from 'express'
import { validateSchema } from '../middleware/validateSchema.middleware.js'
import {
  addResponsable,
  getResponsables,
  getResponsableById,
  updateResponsable,
  deleteResponsable
} from '../controllers/responsable.controller.js'

const router = express.Router()

router.post('/create', addResponsable)

router.get('/get', getResponsables)
router.get('/get/:id', getResponsableById)

router.put('/update/:id', updateResponsable)

router.delete('/delete/:id', deleteResponsable)

export default router
