import { pool } from '../db/db.js'

export const addPrestamo = async (req, res) => {
  const {
    idlaboratorio,
    idusuario,
    fecha,
    horaInicio,
    duracion,
    observaciones,
    estado
  } = req.body
  let sql = 'INSERT INTO prestamo'
  let fields = [
    'idlaboratorio',
    'idusuario',
    'fecha',
    'horaInicio',
    'duracion',
    'estado'
  ]
  let values = [idlaboratorio, idusuario, fecha, horaInicio, duracion, estado]
  if (observaciones) {
    fields.push('observaciones')
    values.push(observaciones)
  }
  sql += ` (${fields.join(', ')}) VALUES (${fields.map(() => '?').join(', ')})`
  try {
    const [result] = await pool.execute(sql, values)
    if (result.affectedRows === 0)
      res
        .status(400)
        .json({ status: 'error', message: 'No se pudo agregar el prestamo' })
    res.status(201).json({ status: 'success', message: 'Préstamo agregado' })
  } catch (error) {
    console.log(error)
    res.status(500).json({ status: 'error', message: error.message })
  }
}

export const getPrestamos = async (req, res) => {
  try {
    const [result] = await pool.execute('SELECT * FROM prestamo')
    if (result.length === 0)
      res.status(404).json({ status: 'error', message: 'No hay prestamos' })
    res.status(200).json({ status: 'success', data: result })
  } catch (error) {
    console.log(error)
    res.status(500).json({ status: 'error', message: error.message })
  }
}

export const getPrestamoById = async (req, res) => {
  const { id } = req.params
  try {
    const sql = `SELECT * FROM prestamo WHERE idprestamo = ?`
    const [result] = await pool.execute(sql, [id])
    if (result.length === 0)
      res
        .status(404)
        .json({ status: 'error', message: 'Prestamos no encontrado' })
    res.status(200).json({ status: 'success', data: result })
  } catch (error) {
    console.log(error)
    res.status(500).json({ status: 'error', message: error.message })
  }
}

export const deletePrestamo = async (req, res) => {
  const { id, estado } = req.params
  const estados = ['C', 'D', 'F']
  if (!estados.includes(estado))
    res.status(400).json({ status: 'error', message: 'Estado inválido' })
  try {
    const sql = `UPDATE prestamo SET estado = ? WHERE idprestamo = ?`
    const [result] = await pool.execute(sql, [estado, id])
    if (result.affectedRows === 0)
      res
        .status(400)
        .json({ status: 'error', message: 'No se pudo eliminar el equipo' })
    res.status(200).json({ status: 'success', data: result })
  } catch (error) {
    console.log(error)
    res.status(500).json({ status: 'error', message: error.message })
  }
}

export const updatePrestamo = async (req, res) => {
  const { id } = req.params
  const {
    idlaboratorio,
    idusuario,
    fecha,
    horaInicio,
    duracion,
    observaciones,
    estado
  } = req.body
  let fields = []
  let values = []
  if (idlaboratorio) {
    fields.push('idlaboratorio = ?')
    values.push(idlaboratorio)
  }
  if (idusuario) {
    fields.push('idusuario = ?')
    values.push(idusuario)
  }
  if (fecha) {
    fields.push('fecha = ?')
    values.push(fecha)
  }
  if (horaInicio) {
    fields.push('horaInicio = ?')
    values.push(horaInicio)
  }
  if (duracion) {
    fields.push('duracion = ?')
    values.push(duracion)
  }
  if (observaciones) {
    fields.push('observaciones = ?')
    values.push(observaciones)
  }
  if (estado) {
    fields.push('estado = ?')
    values.push(estado)
  }
  values.push(id)
  let sql = `UPDATE prestamo SET ${fields.join(', ')} WHERE idprestamo = ?`
  try {
    const [result] = await pool.execute(sql, values)
    if (result.affectedRows === 0)
      res
        .status(400)
        .json({ status: 'error', message: 'No se pudo actualizar el prestamo' })
    res.status(200).json({ status: 'success', message: 'Prestamo actualizado' })
  } catch (error) {
    console.log(error)
    res.status(500).json({ status: 'error', message: error.message })
  }
}
