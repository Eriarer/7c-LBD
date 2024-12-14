import express from 'express'
import { validateSchema } from '../middleware/validateSchema.middleware.js'
import {
  addMaterial,
  getMaterial,
  getMaterialById,
  deleteMaterial
} from '../controllers/material.controller.js'

const router = express.Router()

router.post('/create', addMaterial)

router.get('/get', getMaterial)
router.get('/get/:idprestamo/:idlaboratorio/:idunidad', getMaterialById)

router.delete('/delete/:idprestamo/:idlaboratorio/:idunidad', deleteMaterial)

export default router
