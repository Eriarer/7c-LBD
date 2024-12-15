import { pool } from '../db/db.js'

export const addLaboratorio = async (req, res) => {
  const {
    plantel,
    num_ed,
    aula,
    departamento,
    cupo,
    latitude,
    longitude,
    descripcion
  } = req.body
  let sql = 'INSERT INTO laboratorio'
  const fields = ['num_ed', 'cupo', 'latitude', 'longitude']
  const values = [num_ed, cupo, latitude, longitude]
  if (plantel) {
    fields.push('plantel')
    values.push(plantel)
  }
  if (aula) {
    fields.push('aula')
    values.push(aula)
  }
  if (departamento) {
    fields.push('departamento')
    values.push(departamento)
  }
  if (descripcion) {
    fields.push('descripcion')
    values.push(descripcion)
  }

  sql += ` (${fields.join(', ')}) VALUES (${fields.map(() => '?').join(', ')})`
  try {
    const [result] = await pool.execute(sql, values)
    if (result.affectedRows === 0) {
      return res
        .status(400)
        .json({ status: 'error', message: 'No se pudo agregar el laboratorio' })
    }
    res.status(201).json({ status: 'success', message: 'Laboratorio agregado' })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      status: 'error',
      message: 'Algo ah salido mal, intentalo más tarde'
    })
  }
}

export const getLaboratorios = async (req, res) => {
  try {
    const [result] = await pool.execute('SELECT * FROM laboratorio')
    if (result.length === 0) {
      return res
        .status(404)
        .json({ status: 'error', message: 'No hay laboratorios' })
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

export const getLaboratorioById = async (req, res) => {
  const { id } = req.params
  try {
    const sql = 'SELECT * FROM laboratorio WHERE idLaboratorio = ?'
    const [result] = await pool.execute(sql, [id])
    if (result.length === 0) {
      return res
        .status(404)
        .json({ status: 'error', message: 'Laboratorio no encontrado' })
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

export const deleteLaboratorio = async (req, res) => {
  const { id } = req.params
  try {
    const sql = 'DELETE FROM laboratorio WHERE idLaboratorio = ?'
    const [result] = await pool.execute(sql, [id])
    if (result.affectedRows === 0) {
      return res
        .status(400)
        .json({ status: 'error', message: 'Laboratorio no encontrado' })
    }
    res
      .status(200)
      .json({ status: 'success', message: 'Laboratorio eliminado' })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      status: 'error',
      message: 'Algo ah salido mal, intentalo más tarde'
    })
  }
}

export const updateLaboratorio = async (req, res) => {
  const { id } = req.params
  const {
    plantel,
    num_ed,
    aula,
    departamento,
    cupo,
    latitude,
    longitude,
    descripcion
  } = req.body
  let sql = 'UPDATE laboratorio SET '
  const values = []
  const fields = []
  if (plantel) {
    fields.push('plantel')
    values.push(plantel)
  }
  if (num_ed) {
    fields.push('num_ed')
    values.push(num_ed)
  }
  if (aula) {
    fields.push('aula')
    values.push(aula)
  }
  if (departamento) {
    fields.push('departamento')
    values.push(departamento)
  }
  if (cupo) {
    fields.push('cupo')
    values.push(cupo)
  }
  if (latitude) {
    fields.push('latitude')
    values.push(latitude)
  }
  if (longitude) {
    fields.push('longitude')
    values.push(longitude)
  }
  if (descripcion) {
    fields.push('descripcion')
    values.push(descripcion)
  }
  if (values.length === 0) {
    return res
      .status(400)
      .json({ status: 'error', message: 'Datos insuficientes' })
  }
  sql +=
    fields.map((field) => `${field} = ?`).join(', ') +
    ' WHERE idLaboratorio = ?'
  values.push(id)
  try {
    const [result] = await pool.execute(sql, values)
    if (result.affectedRows === 0) {
      return res
        .status(400)
        .json({ status: 'error', message: 'Laboratorio no encontrado' })
    }
    res
      .status(200)
      .json({ status: 'success', message: 'Laboratorio actualizado' })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      status: 'error',
      message: 'Algo ah salido mal, intentalo más tarde'
    })
  }
}
