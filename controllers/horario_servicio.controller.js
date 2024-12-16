import { pool } from '../db/db.js'

export const addHorarioServicio = async (req, res) => {
  const { idlaboratorio, hora_inicio, hora_cierre, dias } = req.body
  let sql = 'INSERT INTO horario_servicio'
  const fields = ['idlaboratorio', 'hora_inicio', 'hora_cierre', 'dias']
  const values = [idlaboratorio, hora_inicio, hora_cierre, dias]
  sql += ` (${fields.join(', ')}) VALUES (${fields.map(() => '?').join(', ')})`
  try {
    const [result] = await pool.execute(sql, values)
    if (result.affectedRows === 0) {
      return res.status(400).json({
        status: 'error',
        message: 'No se pudo agregar el horario de servicio'
      })
    }
    res
      .status(201)
      .json({ status: 'success', message: 'Horario de servicio agregado' })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      status: 'error',
      message: 'Algo ah salido mal, intentalo más tarde'
    })
  }
}

export const getHorariosServicio = async (req, res) => {
  try {
    const [result] = await pool.execute('SELECT * FROM horario_servicio')
    if (result.length === 0) {
      return res
        .status(404)
        .json({ status: 'error', message: 'No hay horarios de servicio' })
    }
    res.status(200).json({ status: 'success', data: result })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      status: 'error',
      message: 'Algo ah salido mal, intentalo más tarde'
    })
  }
}

export const getHorarioServicioById = async (req, res) => {
  const { id } = req.params
  try {
    const sql = 'SELECT * FROM horario_servicio WHERE idhorario = ?'
    const [result] = await pool.execute(sql, [id])
    if (result.length === 0) {
      return res
        .status(404)
        .json({ status: 'error', message: 'Horario de servicio no encontrado' })
    }
    res.status(200).json({ status: 'success', data: result })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      status: 'error',
      message: 'Algo ah salido mal, intentalo más tarde'
    })
  }
}

export const deleteHorarioServicio = async (req, res) => {
  const { id } = req.params
  try {
    const sql = 'DELETE FROM horario_servicio WHERE idhorario = ?'
    const [result] = await pool.execute(sql, [id])
    if (result.affectedRows === 0) {
      res
        .status(400)
        .json({ status: 'error', message: 'No se pudo eliminar el Horario' })
    }
    res.status(200).json({ status: 'success', data: result })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      status: 'error',
      message: 'Algo ah salido mal, intentalo más tarde'
    })
  }
}

export const updateHorarioServicio = async (req, res) => {
  const { id } = req.params
  const { idlaboratorio, hora_inicio, hora_cierre, dias } = req.body
  let sql = 'UPDATE horario_servicio SET '
  const fields = ['idlaboratorio', 'hora_inicio', 'hora_cierre', 'dias']
  const values = [idlaboratorio, hora_inicio, hora_cierre, dias]
  sql += fields.map((field) => `${field} = ?`).join(', ')
  sql += ' WHERE idhorario = ?'
  values.push(id)
  try {
    const [result] = await pool.execute(sql, values)
    if (result.affectedRows === 0) {
      return res
        .status(400)
        .json({ status: 'error', message: 'No se pudo actualizar el Horario' })
    }
    res.status(200).json({ status: 'success', message: 'Horario actualizado' })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      status: 'error',
      message: 'Algo ah salido mal, intentalo más tarde'
    })
  }
}
