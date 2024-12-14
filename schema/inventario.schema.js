import { z } from 'zod'

export const addInventarioSchema = z.object({
  idlaboratorio: z.number({
    required_error: 'El ID de laboratorio es requerido',
    invalid_type_error: 'El ID de laboratorio debe ser un número'
  }),
  idunidad: z.number({
    required_error: 'El ID de unidad es requerido',
    invalid_type_error: 'El ID de unidad debe ser un número'
  }),
  cantidad: z
    .number({
      required_error: 'La cantidad es requerida',
      invalid_type_error: 'La cantidad debe ser un número'
    })
    .int({ message: 'La cantidad debe ser un número entero' })
    .min(1, { message: 'La cantidad debe ser al menos 1' })
})

export const updateInventarioSchema = z.object({
  idlaboratorio: z
    .number({
      invalid_type_error: 'El ID de laboratorio debe ser un número'
    })
    .optional(),
  idunidad: z
    .number({
      invalid_type_error: 'El ID de unidad debe ser un número'
    })
    .optional(),
  cantidad: z
    .number({
      invalid_type_error: 'La cantidad debe ser un número'
    })
    .int({ message: 'La cantidad debe ser un número entero' })
    .min(1, { message: 'La cantidad debe ser al menos 1' })
    .optional()
})
