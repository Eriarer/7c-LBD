import { z } from 'zod'

export const addUsuarioSchema = z.object({
  idusuario: z
    .string({
      message: 'El Id es requerido'
    })
    .regex(/^[0-9]{1,10}$/, {
      message: 'Id debe ser un número de 1-10 dígitos'
    }),
  nombre: z
    .string({ message: 'Nombre es requerido' })
    .min(4, { message: 'Nombre debe tener al menos 4 caracteres' })
    .max(60, { message: 'Nombre no puede exceder 60 caracteres' }),
  apellido: z
    .string()
    .min(4, { message: 'Apellido debe tener al menos 4 caracteres' })
    .max(60, { message: 'Apellido no puede exceder 60 caracteres' })
    .optional(),
  carrera: z
    .string()
    .min(4, { message: 'Carrera debe tener al menos 4 caracteres' })
    .max(60, { message: 'Carrera no puede exceder 60 caracteres' })
    .optional(),
  correo: z
    .string({ message: 'Correo es requerido' })
    .email({ message: 'Correo inválido' }),
  tipo: z
    .string({ message: 'Tipo es requerido' })
    .length(1, { message: 'Tipo debe ser un caracter' })
    .regex(/^[MAE]$/, { message: 'Tipo debe ser M, A o E' }),
  activo: z
    .boolean() 
    .optional()
})

export const updateUsuarioSchema = z
  .object({
    id: z.string().regex(/^[0-9]{1,10}$/, {
      message: 'Id debe ser un número de 1-10 dígitos'
    }),
    newId: z
      .string()
      .regex(/^[0-9]{1,10}$/, {
        message: 'Nuevo Id debe ser un número de 1-10 dígitos'
      })
      .optional(),
    nombre: z
      .string()
      .min(4, { message: 'Nombre debe tener al menos 4 caracteres' })
      .max(60, { message: 'Nombre no puede exceder 60 caracteres' })
      .optional(),
    apellido: z
      .string()
      .min(4, { message: 'Apellido debe tener al menos 4 caracteres' })
      .max(60, { message: 'Apellido no puede exceder 60 caracteres' })
      .optional(),
    carrera: z
      .string()
      .min(4, { message: 'Carrera debe tener al menos 4 caracteres' })
      .max(60, { message: 'Carrera no puede exceder 60 caracteres' })
      .optional(),
    correo: z.string().email({ message: 'Correo inválido' }).optional(),
    tipo: z
      .string()
      .length(1, { message: 'Tipo debe ser un caracter' })
      .regex(/^[MAE]$/, { message: 'Tipo debe ser M, A o E' })
      .optional(),
    activo: z.boolean().optional()
  })
  .partial()
