import { z } from 'zod'

export const addPrestamoSchema = z.object({
  idlaboratorio: z
    .number({ message: 'El Id de laboratorio es requerido' })
    .int({ message: 'El Id de laboratorio debe ser un número entero' })
    .positive({ message: 'El Id de laboratorio debe ser mayor a 0' }),
  idusuario: z
    .number({ message: 'El Id de usuario es requerido' })
    .int({ message: 'El Id de usuario debe ser un número entero' })
    .positive({ message: 'El Id de usuario debe ser mayor a 0' }),
  fecha: z
    .string({ message: 'La fecha es requerida' })
    .regex(/^\d{4}-\d{2}-\d{2}$/, {
      message: 'La fecha debe estar en formato YYYY-MM-DD'
    }),
  horainicio: z
    .string({ message: 'La hora de inicio es requerida' })
    .regex(/^\d{2}:\d{2}:\d{2}$/, {
      message: 'La hora debe estar en formato HH:MM:SS'
    }),
  duracion: z
    .number({ message: 'La duración es requerida' })
    .int({ message: 'La duración debe ser un número entero' })
    .positive({ message: 'La duración debe ser mayor a 0' }),
  observaciones: z
    .string()
    .max(300, { message: 'Las observaciones no pueden exceder 300 caracteres' })
    .optional(),
  estado: z
    .string({ message: 'El estado es requerido' })
    .length(1, { message: 'El estado debe ser un carácter' })
    .regex(/^[PCADF]$/, { message: 'El estado debe ser P, C, A, D o F' })
    .default('P') // Valor predeterminado 'P'
    .optional(),
  materiales: z
    .array({ message: 'Los materiales deben ser un arreglo de objetos' })
    .optional()
})

export const updatePrestamoSchema = z
  .object({
    idlaboratorio: z
      .number()
      .int({ message: 'El Id de laboratorio debe ser un número entero' })
      .positive({ message: 'El Id de laboratorio debe ser mayor a 0' })
      .optional(),
    idusuario: z
      .number()
      .int({ message: 'El Id de usuario debe ser un número entero' })
      .positive({ message: 'El Id de usuario debe ser mayor a 0' })
      .optional(),
    fecha: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, {
        message: 'La fecha debe estar en formato YYYY-MM-DD'
      })
      .optional(),
    horainicio: z
      .string()
      .regex(/^\d{2}:\d{2}:\d{2}$/, {
        message: 'La hora debe estar en formato HH:MM:SS'
      })
      .optional(),
    duracion: z
      .number()
      .int({ message: 'La duración debe ser un número entero' })
      .positive({ message: 'La duración debe ser mayor a 0' })
      .optional(),
    observaciones: z
      .string()
      .max(300, {
        message: 'Las observaciones no pueden exceder 300 caracteres'
      })
      .optional(),
    estado: z
      .string()
      .length(1, { message: 'El estado debe ser un carácter' })
      .regex(/^[PCADF]$/, { message: 'El estado debe ser P, C, A, D o F' })
      .default('P')
      .optional()
  })
  .partial()
