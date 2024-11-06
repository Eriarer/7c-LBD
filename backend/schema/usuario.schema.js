import { z } from "zod"

export const addUsuarioSchema = z.object({
    idusuario: z.string({
        required_error: 'Id es requerido',
    }).regex(/^[0-9]{1,10}$/),
    tipo: z.string({
        required_error: 'Tipo es requerido',
        invalid_type_error: 'Tipo debe ser un string'
    }).min(1).max(1).regex(/^[MAEP]$/),
    nombre: z.string({
        required_error: 'Nombre es requerido',
        invalid_type_error: 'Nombre debe ser un string'
    }).min(4).max(60),
})


export const updateUsuarioSchema = z.object({
    id: z.string({
        required_error: 'Id es requerido',
    }).regex(/^[0-9]{1,10}$/),
    newId: z.string({
        invalid_type_error: 'Nuevo Id debe ser un string'
    }).regex(/^[0-9]{1,10}$/),
    tipo: z.string({
        invalid_type_error: 'Tipo debe ser un string'
    }).min(1).max(1).regex(/^[MAEP]$/),
    nombre: z.string({
        invalid_type_error: 'Nombre debe ser un string'
    }).min(4).max(60),
})