import express from 'express'
import { validateSchema } from '../middleware/validateSchema.middleware.js'
import {
  addMaterial,
  getMaterial,
  getMaterialById,
  deleteMaterial
} from '../controllers/material.controller.js'

const router = express.Router()

export default router
