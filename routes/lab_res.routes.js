import express from 'express'
import { validateSchema } from '../middleware/validateSchema.middleware.js'
import { addLabRes, deleteLabRes } from '../controllers/lab_res.controller.js'

const router = express.Router()

router.post('/create', addLabRes)
router.delete('/delete/:idlaboratorio/:idresponsable', deleteLabRes)

export default router
