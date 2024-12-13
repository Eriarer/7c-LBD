import express from 'express'
import { validateSchema } from '../middleware/validateSchema.middleware.js'
import {
    addLabRes,
    getLabRes,
    getLabResById,
    deleteLabRes,
} from '../controllers/lab_res.controller.js'

const router = express.Router()

router.post('/create', validateSchema, addLabRes)

router.get('/get', getLabRes)
router.get('/get/:idlaboratorio/:idresponsable', getLabResById)

router.delete('/delete/:idlaboratorio/:idresponsable', deleteLabRes)

export default router