import { z } from 'zod'

export const addHorarioProfesoresSchema = z.object({
  idlaboratorio: z.number({
    required_error: 'El ID de laboratorio es requerido',
    invalid_type_error: 'El ID de laboratorio debe ser un número'
  }),
  idusuario: z.number({
    required_error: 'El ID de usuario es requerido',
    invalid_type_error: 'El ID de usuario debe ser un número'
  }),
  hora_inicio: z
    .string({
      required_error: 'La hora de inicio es requerida'
    })
    .regex(/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/, {
      message: 'La hora de inicio debe estar en formato HH:MM:SS'
    }),
  hora_cierre: z
    .string({
      required_error: 'La hora de cierre es requerida'
    })
    .regex(/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/, {
      message: 'La hora de inicio debe estar en formato HH:MM:SS'
    }),
  dias: z
    .string({
      required_error: 'Los días son requeridos'
    })
    .min(2, { message: 'Debe especificar al menos un día' })
    .max(50, { message: 'Los días no pueden exceder 50 caracteres' }),
  descripcion: z
    .string({
      invalid_type_error: 'La descripción debe ser un texto'
    })
    .max(300, { message: 'La descripción no puede exceder 300 caracteres' })
    .optional()
})

export const updateHorarioProfesoresSchema = z.object({
  idlaboratorio: z
    .number({
      invalid_type_error: 'El ID de laboratorio debe ser un número'
    })
    .optional(),
  idusuario: z
    .number({
      invalid_type_error: 'El ID de usuario debe ser un número'
    })
    .optional(),
  hora_inicio: z
    .string()
    .regex(/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/, {
      message: 'La hora de inicio debe estar en formato HH:MM:SS'
    })
    .optional(),
  hora_cierre: z
    .string()
    .regex(/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/, {
      message: 'La hora de inicio debe estar en formato HH:MM:SS'
    })
    .optional(),
  dias: z
    .string()
    .min(2, { message: 'Debe especificar al menos un día' })
    .max(50, { message: 'Los días no pueden exceder 50 caracteres' })
    .optional(),
  descripcion: z
    .string()
    .max(300, { message: 'La descripción no puede exceder 300 caracteres' })
    .optional()
})