import { z } from 'zod'

export const addUsuarioSchema = z.object({
  idusuario: z.number({
    message: 'El Id es requerido'
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
  password: z
    .string({ message: 'Contraseña es requerida' })
    .min(8, { message: 'Contraseña debe tener al menos 8 caracteres' })
    .max(60, { message: 'Contraseña no puede exceder 60 caracteres' })
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,}$/,
      {
        message:
          'Contraseña debe tener al menos 8 caracteres, 1 mayúscula, 1 minúscula, 1 número y 1 caracter especial'
      }
    ),
  tipo: z
    .enum(['ALUMNO', 'MAESTRO', 'EXTERNO', 'RESPONSABLE', 'AYUDANTE'], {
      message: 'Tipo debe ser ALUMNO, MAESTRO, EXTERNO, RESPONSABLE o AYUDANTE'
    })
    .optional(),
  activo: z.boolean().optional()
})

export const updateUsuarioSchema = z
  .object({
    id: z.number().optional(),
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
      .enum(['ALUMNO', 'MAESTRO', 'EXTERNO', 'RESPONSABLE', 'AYUDANTE'], {
        message:
          'Tipo debe ser ALUMNO, MAESTRO, EXTERNO, RESPONSABLE o AYUDANTE'
      })
      .optional(),
    activo: z.boolean().optional()
  })
  .partial()

export const updatePasswordSchema = z.object({
  password: z
    .string({ message: 'Contraseña es requerida' })
    .min(8, { message: 'Contraseña debe tener al menos 8 caracteres' })
    .max(60, { message: 'Contraseña no puede exceder 60 caracteres' })
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,}$/,
      {
        message:
          'Contraseña debe tener al menos 8 caracteres, 1 mayúscula, 1 minúscula, 1 número y 1 caracter especial'
      }
    ),
  confirmPassword: z.string().refine((data) => data === this.password, {
    message: 'Las contraseñas no coinciden'
  }),
  newPassword: z
    .string({ message: 'Contraseña es requerida' })
    .min(8, { message: 'Contraseña debe tener al menos 8 caracteres' })
    .max(60, { message: 'Contraseña no puede exceder 60 caracteres' })
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,}$/,
      {
        message:
          'Contraseña debe tener al menos 8 caracteres, 1 mayúscula, 1 minúscula, 1 número y 1 caracter especial'
      }
    )
})

export const loginSchema = z.object({
  correo: z.string().email({ message: 'Correo inválido' }),
  password: z
    .string()
    .min(8, { message: 'Contraseña debe tener al menos 8 caracteres' })
    .max(60, { message: 'Contraseña no puede exceder 60 caracteres' })
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,}$/,
      {
        message:
          'Contraseña debe tener al menos 8 caracteres, 1 mayúscula, 1 minúscula, 1 número y 1 caracter especial'
      }
    )
})
