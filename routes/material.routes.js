import express from 'express'
import { validateSchema } from '../middleware/validateSchema.middleware.js'
import {
  addMateriales,
  getMateriales,
  getMaterialById,
  deleteMaterial
} from '../controllers/material.controller.js'

const router = express.Router()

router.post('/', validateSchema('addMaterial'), addMateriales)

router.get('/', getMateriales)
router.get('/:id', getMaterialById)

router.delete('/:id', deleteMaterial)

export default router
