import { Router } from 'express'
import { validateSchema } from '../middleware/validateSchema.middleware.js'
import { loginSchema } from '../schema/usuario.schema.js'
import {
  login,
  decodeToken,
  regeneratToken
} from '../controllers/auth.controller.js'
import {
  verifyToken,
  dropToken,
  refreshToken
} from '../middleware/jwt.middleware.js'

const router = Router()

router.post('/login', validateSchema(loginSchema), login)

router.get('/decode', decodeToken)

router.get('/refresh', refreshToken, regeneratToken)

router.get('/logout', verifyToken, dropToken)

export default router
