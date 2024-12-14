import { pool } from '../db/db.js'

export const addHorarioProfesor = async (req, res) => {
  const {
    idlaboratorio,
    idusuario,
    hora_inicio,
    hora_cierre,
    dias,
    descripcion
  } = req.body
  let sql = 'INSERT INTO horario_profesor'
  const fields = [
    'idlaboratorio',
    'idusuario',
    'hora_inicio',
    'hora_cierre',
    'dias'
  ]
  const values = [idlaboratorio, idusuario, hora_inicio, hora_cierre, dias]
  if (descripcion) {
    fields.push('descripcion')
    values.push(descripcion)
  }
  sql += ` (${fields.join(', ')}) VALUES (${fields.map(() => '?').join(', ')})`

  try {
    const [result] = await pool.execute(sql, values)
    if (result.affectedRows === 0) {
      res.status(400).json({
        status: 'error',
        message: 'No se pudo agregar el horario de profesor'
      })
    }
    res
      .status(201)
      .json({ status: 'success', message: 'Horario de profesor agregado' })
  } catch (error) {
    console.log(error)
    res.status(500).json({ status: 'error', message: error.message })
  }
}

export const getHorariosProfesores = async (req, res) => {
  try {
    const [result] = await pool.execute('SELECT * FROM horario_profesor')
    if (result.length === 0) {
      return res
        .status(404)
        .json({ status: 'error', message: 'No hay horarios de profesores' })
    }
    res.status(200).json({ status: 'success', data: result })
  } catch (error) {
    console.log(error)
    res.status(500).json({ status: 'error', message: error.message })
  }
}

export const getHorarioProfesor = async (req, res) => {
  const { id } = req.params
  try {
    const [result] = await pool.execute(
      'SELECT * FROM horario_profesor WHERE idhorario = ?',
      [id]
    )
    if (result.length === 0) {
      return res
        .status(404)
        .json({ status: 'error', message: 'Horario de profesor no encontrado' })
    }
    res.status(200).json({ status: 'success', data: result[0] })
  } catch (error) {
    console.log(error)
    res.status(500).json({ status: 'error', message: error.message })
  }
}

export const updateHorarioProfesor = async (req, res) => {
  const { id } = req.params
  const {
    idlaboratorio,
    idusuario,
    hora_inicio,
    hora_cierre,
    dias,
    descripcion
  } = req.body

  let sql = 'UPDATE horario_profesor SET '
  const values = []
  const fields = []
  if (idlaboratorio) {
    fields.push('idlaboratorio')
    values.push(idlaboratorio)
  }
  if (idusuario) {
    fields.push('idusuario')
    values.push(idusuario)
  }
  if (hora_inicio) {
    fields.push('hora_inicio')
    values.push(hora_inicio)
  }
  if (hora_cierre) {
    fields.push('hora_cierre')
    values.push(hora_cierre)
  }
  if (dias) {
    fields.push('dias')
    values.push(dias)
  }
  if (descripcion) {
    fields.push('descripcion')
    values.push(descripcion)
  }
  if (fields.length === 0) {
    return res
      .status(400)
      .json({ status: 'error', message: 'Datos insuficientes' })
  }

  sql += fields.map((field) => ` ${field} = ?`).join(', ')
  sql += ' WHERE idhorario = ?'
  values.push(id)
  try {
    const [result] = await pool.execute(sql, values)
    if (result.affectedRows === 0) {
      return res
        .status(400)
        .json({ status: 'error', message: 'No se pudo actualizar el horario' })
    }

    res
      .status(200)
      .json({ status: 'success', message: 'Horario de profesor actualizado' })
  } catch (error) {
    console.log(error)
    res.status(500).json({ status: 'error', message: error.message })
  }
}

export const deleteHorarioProfesor = async (req, res) => {
  const { id } = req.params
  try {
    const [result] = await pool.execute(
      'DELETE FROM horario_profesor WHERE idhorario = ?',
      [id]
    )
    if (result.affectedRows === 0) {
      return res
        .status(400)
        .json({ status: 'error', message: 'No se pudo eliminar el horario' })
    }
    res
      .status(200)
      .json({ status: 'success', message: 'Horario de profesor eliminado' })
  } catch (error) {
    console.log(error)
    res.status(500).json({ status: 'error', message: error.message })
  }
}
