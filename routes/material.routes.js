import express from 'express'
import { validateSchema } from '../middleware/validateSchema.middleware.js'
import {
    addMaterial,
    getMaterial,
    getMaterialById,
    deleteMaterial,
} from '../controllers/material.controller.js'

const router = express.Router()

router.post('/create', validateSchema, addMaterial)

router.get('/get', getMaterial)
router.get('/get/:id', getMaterialById)

router.delete('/delete/:id', deleteMaterial)


export default router