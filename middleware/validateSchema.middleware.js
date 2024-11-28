export const validateSchema = (schema) => {
  return (req, res, next) => {
    try {
      schema.parse(req.body)
      next()
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errorMessages = error.errors.map(err => ({
          field: err.path[0],
          message: err.message
        }))
        return res.status(400).json({
          error: 'Validation failed',
          details: errorMessages
        })
      }
      res.status(500).json({ error: 'Internal server error' })
    }
  }
}