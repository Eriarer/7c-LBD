import express from 'express'
import { validateSchema } from '../middleware/validateSchema.middleware.js'
import {
  addInventario,
  getInventarios,
  getInventarioById,
  deleteInventario,
  updateInventario
} from '../controllers/inventario.controller.js'
import {
  addInventarioSchema,
  updateInventarioSchema
} from '../schema/inventario.schema.js'

const router = express.Router()

router.post('/create', validateSchema(addInventarioSchema), addInventario)

router.get('/get', getInventarios)
router.get('/get/:idlaboratorio/:idunidad', getInventarioById)

router.delete('/delete/:idlaboratorio/:idunidad', deleteInventario)

router.put(
  '/update/:idlaboratorio/:idunidad',
  validateSchema(updateInventarioSchema),
  updateInventario
)

export default router
