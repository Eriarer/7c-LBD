import { on } from "nodemon"

export const RESPONSABLE = {
  table: 'responsable',
  pirmaryKeys: ['idresponsable'],
  searchFields: {
    idresponsable: {field: 'idresponsable', type: 'in'},
    nombre: {field: 'nombre', type: 'like'},
    tipo: {field: 'tipo', type: 'in'},
    activo: {field: 'activo', type: 'boolean'}
  },
  updateFields: {
    idresponsable: { field: 'idresponsable'},
    nombre: { field: 'nombre'},
    tipo: { field: 'tipo'},
    activo: { field: 'activo'}
  },
  defaultSort: { flied: 'codigo', order: 'DESC' },
  selectedFields: 'responsable.*'
}

export const LABORATORIO = {
  table: 'laboratorio',
  pirmaryKeys: ['idlaboratorio'],
  searchFields: {
    idlaboratorio: {field: 'idlaboratorio', type: 'in'},
    plantel: {field: 'plantel', type: 'like'},
    num_edificio: {field: 'num_ed', type: 'like'},
    aula: {field: 'aula', type: 'like'},
    departamento: {field: 'departamento', type: 'like'},
    cupo: {field: 'cupo', type: 'range'}
  },
  updateFields: {
    idlaboratorio: { field: 'idlaboratorio'},
    plantel: { field: 'plantel'},
    num_edificio: { field: 'num_ed'},
    aula: { field: 'aula'},
    departamento: { field: 'departamento'},
    cupo: { field: 'cupo'}
  },
  defaultSort: { flied: 'idlaboratorio', order: 'DESC' },
  joins: [
    {table: 'lab_res', on: 'laboratorio.idlaboratorio = lab_res.idlaboratorio', sortableFields: ['idlaboratorio']},
    {table: 'responsable', on: 'lab_res.idresponsable = responsable.idresponsable', sortableFields: ['nombre']},
    {table: 'inventario.idlaboratorio = laboratorio.idlaboratorio', sortableFields: ['idunidad']},
    {table: 'horario', on: 'horario.idlaboratoio = laboratorio.idlaboratorio', sortableFields: ['dia', 'hora_inicio', 'hora_cierre']},
    {table: 'prestamo', on: 'prestamo.idlaboratorio = laboratorio.idlaboratorio', sortableFields: ['idprestamo']}],
  selectedFields: 'laboratorio.*, responsable.idresponsable, responsable.nombre, inventario.idunidad, horario.idhorario, horario.hora_inicio, horario.hora_cierre, prestamo.idprestamo, prestamo.idusuario, prestamo.fecha'
}




