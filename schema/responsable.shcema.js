import { z } from 'zod';

export const addResponsableSchema = z.object({
  idresponsable: z
    .string({ message: 'El ID del responsable es requerido' })
    .min(1, { message: 'El ID debe tener al menos 1 carácter' })
    .max(60, { message: 'El ID no puede exceder 60 caracteres' }),
  nombre: z
    .string({ message: 'El nombre es requerido' })
    .min(1, { message: 'El nombre debe tener al menos 1 carácter' })
    .max(60, { message: 'El nombre no puede exceder 60 caracteres' }),
  tipo: z
    .string({ message: 'El tipo es requerido' })
    .regex(/^[EPA]$/, { message: 'El tipo debe ser "E", "P" o "A"' }),
  activo: z
    .boolean()
    .default(true)
});

export const updateResponsableSchema = z
  .object({
    idresponsable: z
      .string()
      .min(1, { message: 'El ID debe tener al menos 1 carácter' })
      .max(60, { message: 'El ID no puede exceder 60 caracteres' })
      .optional(),
    nombre: z
      .string()
      .min(1, { message: 'El nombre debe tener al menos 1 carácter' })
      .max(60, { message: 'El nombre no puede exceder 60 caracteres' })
      .optional(),
    tipo: z
      .string()
      .regex(/^[EPA]$/, { message: 'El tipo debe ser "E", "P" o "A"' })
      .optional(),
    activo: z.boolean().optional()
  })
  .partial();
