import { z } from 'zod'

export const addLaboratorioSchema = z.object({
  plantel: z
    .string({ message: 'Plantel es requerido' })
    .min(1, { message: 'Plantel debe tener al menos 1 carácter' })
    .max(50, { message: 'Plantel no puede exceder 50 caracteres' })
    .optional(),
  num_ed: z
    .number({ message: 'Número de edificio debe ser un número' })
    .positive({ message: 'Número de edificio debe ser mayor a 0' }),
  aula: z
    .string()
    .max(20, { message: 'Aula no puede exceder 6 caracteres' })
    .optional(),
  departamento: z
    .string({ message: 'Departamento es requerido' })
    .min(1, { message: 'Departamento debe tener al menos 1 carácter' })
    .max(80, { message: 'Departamento no puede exceder 80 caracteres' })
    .optional(),
  cupo: z
    .number({ message: 'Cupo es requerido' })
    .int({ message: 'Cupo debe ser un número entero' })
    .positive({ message: 'Cupo debe ser mayor a 0' })
    .default(1),
  latitude: z
    .number({ message: 'Debe ser un número' })
    .min(-90, { message: 'Latitud debe ser mayor a -90' })
    .max(90, { message: 'Latitud debe ser menor a 90' }),
  longitude: z
    .number({ message: 'Debe ser un número' })
    .min(-180, { message: 'Longitud debe ser mayor a -180' })
    .max(180, { message: 'Longitud debe ser menor a 180' }),
  descripcion: z
    .string({ message: 'Descripcion debe ser un string' })
    .max(150, { message: 'Descripción no puede exceder 255 caracteres' })
    .optional()
})

export const updateLaboratorioSchema = z
  .object({
    plantel: z
      .string()
      .min(1, { message: 'Plantel debe tener al menos 1 carácter' })
      .max(50, { message: 'Plantel no puede exceder 50 caracteres' })
      .optional(),
    num_ed: z
      .number({ message: 'Número de edificio debe ser un número' })
      .positive({ message: 'Número de edificio debe ser mayor a 0' })
      .optional(),
    aula: z
      .string()
      .max(20, { message: 'Aula no puede exceder 6 caracteres' })
      .optional(),
    departamento: z
      .string()
      .min(1, { message: 'Departamento debe tener al menos 1 carácter' })
      .max(80, { message: 'Departamento no puede exceder 80 caracteres' })
      .optional(),
    cupo: z
      .number()
      .int({ message: 'Cupo debe ser un número entero' })
      .positive({ message: 'Cupo debe ser mayor a 0' })
      .optional(),
    latitude: z
      .number({ message: 'Debe ser un número' })
      .min(-90, { message: 'Latitud debe ser mayor a -90' })
      .max(90, { message: 'Latitud debe ser menor a 90' })
      .optional(),
    longitude: z
      .number({ message: 'Debe ser un número' })
      .min(-180, { message: 'Longitud debe ser mayor a -180' })
      .max(180, { message: 'Longitud debe ser menor a 180' })
      .optional(),
    descripcion: z
      .string({ message: 'Descripcion debe ser un string' })
      .max(150, { message: 'Descripcion no puede exceder 150 caracteres' })
      .optional()
  })
  .partial()
