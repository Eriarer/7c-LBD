import { z } from 'zod'

export const addMaterialSchema = z.object({
  idprestamo: z
    .number({ message: 'El Id de préstamo es requerido' })
    .int({ message: 'El Id de préstamo debe ser un número entero' })
    .positive({ message: 'El Id de préstamo debe ser mayor a 0' }),
  idlaboratorio: z
    .number({ message: 'El Id de laboratorio es requerido' })
    .int({ message: 'El Id de laboratorio debe ser un número entero' })
    .positive({ message: 'El Id de laboratorio debe ser mayor a 0' }),
  idunidad: z
    .number({ message: 'El Id de unidad es requerido' })
    .int({ message: 'El Id de unidad debe ser un número entero' })
    .positive({ message: 'El Id de unidad debe ser mayor a 0' }),
  cantidad: z
    .number({ message: 'La cantidad es requerida' })
    .int({ message: 'La cantidad debe ser un número entero' })
    .positive({ message: 'La cantidad debe ser mayor a 0' })
})

export const updateMaterialSchema = z.object({
  cantidad: z
    .number({ message: 'La cantidad es requerida' })
    .int({ message: 'La cantidad debe ser un número entero' })
    .positive({ message: 'La cantidad debe ser mayor a 0' })
})
