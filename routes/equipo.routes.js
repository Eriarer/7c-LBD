import express from 'express'
import { validateSchema } from '../middleware/validateSchema.middleware.js'
import {
  addEquipo,
  getEquipo,
  getEquipoById,
  deleteEquipo,
  updateEquipo
} from '../controllers/equipo.controller.js'

const router = express.Router()

router.post('/create', validateSchema, addEquipo)

router.get('/get', getEquipo)
router.get('/get/:id', getEquipoById)

router.delete('/delete/:id', deleteEquipo)

router.put('/update/:id', validateSchema, updateEquipo)

export default router
