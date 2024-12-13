import { pool } from '../db/db.js'

export const addResponsable = async (req, res) => {
  const { idresponsable, nombre} = req.body
  try {
    const sql = 'INSERT INTO responsable'
    const fields = ['idresponsable', 'nombre']
    const values = [idresponsable, nombre]
    if(tipo){
      fields.push('tipo')
      values.push(tipo)
    }
    sql += ` (${fields.join(', ')}) VALUES (${fields
      .map(() => '?')
      .join(', ')})`
    const [result] = await pool.execute(sql, values)
    res.status(201).json(result)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

export const getResponsables = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM responsable')
    res.status(200).json(result)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

export const getResponsableById = async (req, res) => {
  const id = req.params.id
  try {
    const sql = 'SELECT * FROM responsable WHERE idresponsable = ?'
    const [results] = await pool.query(sql, [id])
    res.status(200).json(results)
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: error.message })
  }
}

export const updateResponsable = async (req, res) => {
  const { idresponsable, newIdresponsable, nombre, tipo } = req.body
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
    res.status(200).json(results)
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: error.message })
  }
}

export const deleteResponsable = async (req, res) => {
  const { idresponsable } = req.params
  try {
    const sql = 'DELETE FROM responsable WHERE idresponsable = ?'
    const [results] = await pool.query(sql, [idresponsable])
    res.status(200).json(results)
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: error.message })
  }
}
