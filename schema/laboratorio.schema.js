import { z } from 'zod';

export const addLaboratorioSchema = z.object({
  plantel: z
    .string({ message: 'Plantel es requerido' })
    .min(1, { message: 'Plantel debe tener al menos 1 carácter' })
    .max(50, { message: 'Plantel no puede exceder 50 caracteres' }),
  num_ed: z
    .number({ message: 'Número de edificio es requerido' })
    .int({ message: 'Número de edificio debe ser un entero' })
    .positive({ message: 'Número de edificio debe ser mayor a 0' }),
  aula: z
    .string()
    .max(6, { message: 'Aula no puede exceder 6 caracteres' })
    .optional(),
  departamento: z
    .string({ message: 'Departamento es requerido' })
    .min(1, { message: 'Departamento debe tener al menos 1 carácter' })
    .max(80, { message: 'Departamento no puede exceder 80 caracteres' }),
  cupo: z
    .number({ message: 'Cupo es requerido' })
    .int({ message: 'Cupo debe ser un número entero' })
    .positive({ message: 'Cupo debe ser mayor a 0' })
    .default(1)
});

export const updateLaboratorioSchema = z
.object({
  idlaboratorio: z
    .number()
    .int({ message: 'Id debe ser un número entero' })
    .positive({ message: 'Id debe ser mayor a 0' })
    .optional(),
  plantel: z
    .string()
    .min(1, { message: 'Plantel debe tener al menos 1 carácter' })
    .max(50, { message: 'Plantel no puede exceder 50 caracteres' })
    .optional(),
  num_ed: z
    .number()
    .int({ message: 'Número de edificio debe ser un entero' })
    .positive({ message: 'Número de edificio debe ser mayor a 0' })
    .optional(),
  aula: z.string().max(6, { message: 'Aula no puede exceder 6 caracteres' }).optional(),
  departamento: z
    .string()
    .min(1, { message: 'Departamento debe tener al menos 1 carácter' })
    .max(80, { message: 'Departamento no puede exceder 80 caracteres' })
    .optional(),
  cupo: z
    .number()
    .int({ message: 'Cupo debe ser un número entero' })
    .positive({ message: 'Cupo debe ser mayor a 0' })
    .optional()
})
.partial();
