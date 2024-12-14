import { pool } from '../db/db.js'

export const addResponsable = async (req, res) => {
  const { idresponsable, nombre, tipo } = req.body
  const fields = ['idresponsable', 'nombre']
  const values = [idresponsable, nombre]
  if (tipo) {
    fields.push('tipo')
    values.push(tipo)
  }
  const sql =
    'INSERT INTO responsable' +
    fields.join(', ') +
    ' VALUES ' +
    values.map(() => '?').join(', ')
  try {
    const [result] = await pool.execute(sql, values)
    if (result.affectedRows === 0) {
      res
        .status(400)
        .json({ status: 'error', message: 'No se pudo agregar el equipo' })
    }
    res.status(201).json({ status: 'success', data: result })
  } catch (error) {
    res.status(400).json({ status: 'error', message: error.message })
  }
}

export const getResponsables = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM responsable')
    if (result.length === 0) {
      res.status(404).json({ status: 'error', message: 'No hay responsables' })
    }
    res.status(200).json({ status: 'success', data: result })
  } catch (error) {
    res.status(400).json({ status: 'error', message: error.message })
  }
}

export const getResponsableById = async (req, res) => {
  const id = req.params.id
  try {
    const sql = 'SELECT * FROM responsable WHERE idresponsable = ?'
    const [results] = await pool.query(sql, [id])
    if (results.length === 0) {
      res
        .status(404)
        .json({ status: 'error', message: 'Responsable no encontrado' })
    }
    res.status(200).json({ status: 'success', data: results })
  } catch (error) {
    console.log(error)
    res.status(500).json({ status: 'error', message: error.message })
  }
}

export const updateResponsable = async (req, res) => {
  const idresponsable = req.params
  const { newIdresponsable, nombre, tipo } = req.body
  let sql = 'UPDATE responsable SET '
  const values = []
  if (newIdresponsable) {
    sql += ' idresponsable = ?,'
    values.push(newIdresponsable)
  }
  if (nombre) {
    sql += ' nombre = ?,'
    values.push(nombre)
  }
  if (tipo) {
    sql += ' tipo = ?,'
    values.push(tipo)
  }
  if (values.length === 0) {
    return res.status(400).json({ error: 'Datos insuficientes' })
  }
  sql = sql.slice(0, -1)
  sql += ' WHERE idresponsable = ?'
  values.push(idresponsable)
  try {
    const [results] = await pool.query(sql, values)
    if (results.affectedRows === 0) {
      res.status(400).json({
        status: 'error',
        message: 'No se pudo actualizar el responsable'
      })
    }
    res.status(200).json({ status: 'success', data: results })
  } catch (error) {
    console.log(error)
    res.status(500).json({ status: 'error', message: error.message })
  }
}

export const deleteResponsable = async (req, res) => {
  const { idresponsable } = req.params
  try {
    const sql = 'UPDATE responsable SET activo = 0 WHERE idresponsable = ?'
    const [results] = await pool.query(sql, [idresponsable])
    if (results.affectedRows === 0) {
      res.status(400).json({
        status: 'error',
        message: 'No se pudo eliminar el responsable'
      })
    }
    res.status(200).json({ status: 'success', data: results })
  } catch (error) {
    console.log(error)
    res.status(500).json({ status: 'error', message: error.message })
  }
}
