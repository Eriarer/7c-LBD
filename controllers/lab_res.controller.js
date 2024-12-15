import { pool } from '../db/db.js'

export const addLabRes = async (req, res) => {
  const { idlaboratorio, idresponsable } = req.body
  let sql = 'INSERT INTO laboratorio_responsable'
  const fields = ['idlaboratorio', 'idresponsable']
  const values = [idlaboratorio, idresponsable]
  sql += ` (${fields.join(', ')}) VALUES (${fields.map(() => '?').join(', ')})`
  try {
    const [result] = await pool.execute(sql, values)
    if (result.affectedRows === 0) {
      res.status(400).json({
        status: 'error',
        message: 'No se pudo hacer la relacion lab_res'
      })
    }
    res.status(201).json({
      status: 'success',
      message: 'Relación laboratorio-responsable agregada'
    })
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

export const deleteLabRes = async (req, res) => {
  const { idlaboratorio, idresponsable } = req.params
  try {
    const sql =
      'DELETE FROM laboratorio_responsable WHERE idlaboratorio = ? AND idresponsable = ?'
    const [result] = await pool.execute(sql, [idlaboratorio, idresponsable])
    if (result.affectedRows === 0) {
      res.status(400).json({
        status: 'error',
        message: 'No se pudo eliminar la relacion lab_res'
      })
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
