import { Router } from 'express'
import { validateSchema } from '../middleware/validateSchema.middleware.js'
import { loginSchema } from '../schema/usuario.schema.js'
import {
  login,
  readToken,
  regenerateToken
} from '../controllers/auth.controller.js'
import {
  verifyToken,
  dropToken,
  decodeToken,
  refreshToken
} from '../middleware/jwt.middleware.js'

const router = Router()

router.post('/login', validateSchema(loginSchema), login)

router.get('/decode', decodeToken, readToken)

router.get('/refresh', refreshToken, regenerateToken)

router.get('/logout', verifyToken, dropToken)

export default router
