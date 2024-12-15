import { pool } from '../db/db.js'

export const addMateriales = async (req, res) => {
  const { idprestamo, idlaboratorio, idunidad, cantidad } = req.body
  let sql = 'INSERT INTO materiales'
  const fields = ['idprestamo', 'idlaboratorio', 'idunidad', 'cantidad']
  const values = [idprestamo, idlaboratorio, idunidad, cantidad]
  sql += ` (${fields.join(', ')}) VALUES (${fields.map(() => '?').join(', ')})`
  try {
    const [result] = await pool.execute(sql, values)
    if (result.affectedRows === 0) {
      res
        .status(400)
        .json({ status: 'error', message: 'No se pudo agregar el material' })
    }
    res.status(201).json({ status: 'success', message: 'Material agregado' })
  } catch (error) {
    console.log(error)
    res
      .status(500)
      .json({
        status: 'error',
        message: 'Algo ah salido mal, intentalo más tarde'
      })
  }
}

export const getMateriales = async (req, res) => {
  try {
    const [result] = await pool.execute('SELECT * FROM materiales')
    if (result.length === 0) {
      res.status(404).json({ status: 'error', message: 'No hay Materiales' })
    }
    res.status(200).json({ status: 'success', data: result })
  } catch (error) {
    console.log(error)
    res
      .status(500)
      .json({
        status: 'error',
        message: 'Algo ah salido mal, intentalo más tarde'
      })
  }
}

export const getMaterialById = async (req, res) => {
  const { idprestamo, idlaboratorio, idunidad } = req.params
  try {
    const sql =
      'SELECT * FROM materiales WHERE idprestamo = ? AND idlaboratorio = ? AND idunidad = ?'
    const [result] = await pool.execute(sql, [
      idprestamo,
      idlaboratorio,
      idunidad
    ])
    if (result.length === 0) {
      res
        .status(404)
        .json({ status: 'error', message: 'Material no encontrado' })
    }
    res.status(200).json({ status: 'success', data: result })
  } catch (error) {
    console.log(error)
    res
      .status(500)
      .json({
        status: 'error',
        message: 'Algo ah salido mal, intentalo más tarde'
      })
  }
}

export const deleteMaterial = async (req, res) => {
  const { idprestamo, idlaboratorio, idunidad } = req.params
  try {
    const sql = `DELETE FROM materiales WHERE idprestamo = ? AND idlaboratorio = ? AND idunidad = ?`
    const [result] = await pool.execute(sql, [
      idprestamo,
      idlaboratorio,
      idunidad
    ])
    if (result.affectedRows === 0) {
      res
        .status(400)
        .json({ status: 'error', message: 'No se pudo eliminar el material' })
    }
    res.status(200).json({ status: 'success', data: result })
  } catch (error) {
    console.log(error)
    res
      .status(500)
      .json({
        status: 'error',
        message: 'Algo ah salido mal, intentalo más tarde'
      })
  }
}
