import { z } from 'zod'

export const validateSchema = (schema) => {
  return (req, res, next) => {
    try {
      console.log('req.body', req.body)
      req.body = schema.parse(req.body)
      next()
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errorMessages = error.errors.map((err) => ({
          campo: err.path[0],
          message: err.message
        }))
        return res.status(400).json({
          error: 'Error de validación',
          message: errorMessages
        })
      }
      res.status(500).json({ error: 'Internal server error' })
    }
  }
}
