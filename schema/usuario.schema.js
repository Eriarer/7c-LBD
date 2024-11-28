import { z } from 'zod'

export const addUsuarioSchema = z.object({
  idusuario: z.preprocess(
    (val) => String(val),
    z
      .string({
        required_error: 'Id es requerido'
      })
      .regex(/^[0-9]{1,10}$/, {
        message: 'Id debe ser un número de 1-10 dígitos'
      })
  ),
  tipo: z.preprocess(
    (val) => String(val),
    z
      .string({
        required_error: 'Tipo es requerido',
        invalid_type_error: 'Tipo debe ser un string'
      })
      .min(1)
      .max(1)
      .regex(/^[MAE]$/, { message: 'Tipo debe ser M, A o E' })
  ),
  nombre: z.preprocess(
    (val) => String(val),
    z
      .string({
        required_error: 'Nombre es requerido',
        invalid_type_error: 'Nombre debe ser un string'
      })
      .min(4, { message: 'Nombre debe tener al menos 4 caracteres' })
      .max(60, { message: 'Nombre no puede exceder 60 caracteres' })
  )
})

export const updateUsuarioSchema = z.object({
  id: z.preprocess(
    (val) => String(val),
    z
      .string({
        required_error: 'Id es requerido'
      })
      .regex(/^[0-9]{1,10}$/, {
        message: 'Id debe ser un número de 1-10 dígitos'
      })
  ),
  newId: z.preprocess(
    (val) => (val === null ? null : String(val)),
    z.union([
      z.string().regex(/^[0-9]{1,10}$/, {
        message: 'Nuevo Id debe ser un número de 1-10 dígitos'
      }),
      z.null()
    ])
  ),
  tipo: z.preprocess(
    (val) => (val === null ? null : String(val)),
    z.union([
      z
        .string()
        .min(1)
        .max(1)
        .regex(/^[MAE]$/, { message: 'Tipo debe ser M, A o E' }),
      z.null()
    ])
  ),
  nombre: z.preprocess(
    (val) => (val === null ? null : String(val)),
    z.union([
      z
        .string()
        .min(4, { message: 'Nombre debe tener al menos 4 caracteres' })
        .max(60, { message: 'Nombre no puede exceder 60 caracteres' }),
      z.null()
    ])
  )
})
