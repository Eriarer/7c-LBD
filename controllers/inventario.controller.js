import { pool } from '../db/db.js'

export const addInventario = async (req, res) => {
  const { idlaboratorio, idunidad, cantidad } = req.body
  let sql = 'INSERT INTO inventario'
  const fields = ['idlaboratorio', 'idunidad', 'cantidad']
  const values = [idlaboratorio, idunidad, cantidad]
  sql += ` (${fields.join(', ')}) VALUES (${fields.map(() => '?').join(', ')})`
  try {
    const [result] = await pool.execute(sql, values)
    if (result.affectedRows === 0) {
      res
        .status(400)
        .json({ status: 'error', message: 'No se pudo crear el inventario' })
    }
    res.status(201).json({ status: 'success', message: 'Inventario agregado' })
  } catch (error) {
    console.log(error)
    res.status(500).json({ status: 'error', message: error.message })
  }
}

export const getInventarios = async (req, res) => {
  try {
    const [result] = await pool.execute('SELECT * FROM inventario')
    if (result.length === 0) {
      return res
        .status(404)
        .json({ status: 'error', message: 'No hay inventarios' })
    }
    res.status(200).json({ status: 'success', data: result })
  } catch (error) {
    console.log(error)
    res.status(500).json({ status: 'error', message: error.message })
  }
}

export const getInventarioById = async (req, res) => {
  const { idlaboratorio, idunidad } = req.params
  try {
    const sql =
      'SELECT * FROM inventario WHERE idlaboratorio = ? AND idunidad = ?'
    const [result] = await pool.execute(sql, [idlaboratorio, idunidad])
    if (result.length === 0) {
      res.status(404).json({ status: 'error', message: 'No hay inventarios' })
    }
    res.status(200).json({ status: 'success', data: result })
  } catch (error) {
    console.log(error)
    res.status(500).json({ status: 'error', message: error.message })
  }
}

export const deleteInventario = async (req, res) => {
  const { idlaboratorio, idunidad } = req.params
  try {
    const sql =
      'DELETE FROM inventario WHERE idlaboratorio = ? AND idunidad = ?'
    const [result] = await pool.execute(sql, [idlaboratorio, idunidad])
    if (result.affectedRows === 0) {
      res
        .status(400)
        .json({ status: 'error', message: 'No se pudo eliminar el inventario' })
    }
    res.status(200).json({ status: 'success', data: result })
  } catch (error) {
    console.log(error)
    res.status(500).json({ status: 'error', message: error.message })
  }
}
