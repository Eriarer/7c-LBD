import { z } from 'zod'

export const validateSchema = (schema) => {
  return (req, res, next) => {
    try {
      req.body = schema.parse(req.body)
      next()
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errorMessages = error.errors.map((err) => ({
          campo: err.path[0],
          message: err.message
        }))
        console.error('Error de validación:', errorMessages)
        return res.status(400).json({
          error: 'Error de validación',
          message: errorMessages
        })
      }
      res.status(500).json({ error: 'Internal server error' })
    }
  }
}
