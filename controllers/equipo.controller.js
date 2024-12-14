import { pool } from '../db/db.js'

export const addEquipo = async (req, res) => {
  const { nombre, descripcion, disponible } = req.body
  let sql = 'INSERT INTO equipo'
  const fields = ['nombre']
  const values = [nombre]
  if (descripcion) {
    fields.push('descripcion')
    values.push(descripcion)
  }
  if (disponible) {
    fields.push('disponible')
    values.push(disponible)
  }

  sql += ` (${fields.join(', ')}) VALUES (${fields.map(() => '?').join(', ')})`
  try {
    const [result] = await pool.execute(sql, values)
    if (result.affectedRows === 0) {
      res
        .status(400)
        .json({ status: 'error', message: 'No se pudo agregar el equipo' })
    }

    res.status(201).json({ status: 'success', message: 'Equipo agregado' })
  } catch (error) {
    console.log(error)
    res.status(500).json({ status: 'error', message: error.message })
  }
}

export const getEquipos = async (req, res) => {
  try {
    const [result] = await pool.execute('SELECT * FROM equipo')
    if (result.length === 0) {
      res.status(404).json({ status: 'error', message: 'No hay equipos' })
    }
    res.status(200).json({ status: 'success', data: result })
  } catch (error) {
    console.log(error)
    res.status(500).json({ status: 'error', message: error.message })
  }
}

export const getEquipoById = async (req, res) => {
  const { id } = req.params
  try {
    const sql = 'SELECT * FROM equipo WHERE idequipo = ?'
    const [result] = await pool.execute(sql, [id])
    if (result.length === 0) {
      res.status(404).json({ status: 'error', message: 'Equipo no encontrado' })
    }
    res.status(200).json({ status: 'success', data: result })
  } catch (error) {
    console.log(error)
    res.status(500).json({ status: 'error', message: error.message })
  }
}

export const deleteEquipo = async (req, res) => {
  const { id } = req.params
  try {
    const sql = 'UPDATE equipo SET disponible = 0 WHERE idequipo = ?'
    const [result] = await pool.execute(sql, [id])
    if (result.affectedRows === 0) {
      res
        .status(400)
        .json({ status: 'error', message: 'No se pudo eliminar el equipo' })
    }
    res.status(200).json({ status: 'success', data: result })
  } catch (error) {
    console.log(error)
    res.status(500).json({ status: 'error', message: error.message })
  }
}

export const updateEquipo = async (req, res) => {
  const { id } = req.params
  const { nombre, descripcion, disponible } = req.body
  let sql = 'UPDATE equipo SET '
  const values = []
  const fields = []
  if (nombre) {
    fields.push('nombre')
    values.push(nombre)
  }
  if (descripcion) {
    fields.push('descripcion')
    values.push(descripcion)
  }
  if (disponible) {
    fields.push('disponible')
    values.push(disponible)
  }
  if (values.length === 0) {
    return res
      .status(400)
      .json({ status: 'error', message: 'No hay campos para actualizar' })
  }
  sql +=
    fields.map((field, index) => `${field} = ?`).join(', ') +
    ' WHERE idequipo = ?'
  values.push(id)
  try {
    const [result] = await pool.execute(sql, values)
    if (result.affectedRows === 0) {
      res.status(400).json({
        status: 'error',
        message: 'No se pudo actualizar el equipo, equipo no encontrado'
      })
    }

    res.status(200).json({ status: 'success', data: result })
  } catch (error) {
    console.log(error)
    res.status(500).json({ status: 'error', message: error.message })
  }
}
