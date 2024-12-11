import { pool } from '../db/db.js'

export const addEquipo = async (req, res) => {
  const { idEquipo, nombre, descripcion } = req.body
  try {
    const sql = `INSERT INTO equipo (idEquipo, nombre, descripcion) VALUES ($?, $?, $?)`
    const [result] = await pool.execute(sql, [idEquipo, nombre, descripcion])
    res.status(201).json(result)
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: error.message })
  }
}

export const getEquipos = async (req, res) => {
  try {
    const [result] = await pool.execute('SELECT * FROM equipo')
    res.status(200).json(result)
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: error.message })
  }
}

export const getEquipoById = async (req, res) => {
  const { id } = req.params
  try {
    const sql = `SELECT * FROM equipo WHERE idEquipo = ?`
    const [result] = await pool.execute(sql, [id])
    res.status(200).json(result)
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: error.message })
  }
}

export const deleteEquipo = async (req, res) => {
  const { id } = req.params
  try {
    const sql = `DELETE FROM equipo WHERE idEquipo = ?`
    const [result] = await pool.execute(sql, [id])
    res.status(200).json(result)
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: error.message })
  }
}

export const updateEquipo = async (req, res) => {
  const { idEquipo, nombre, descripcion } = req.body
  let sql = `UPDATE equipo SET `
  const values = []
  if (nombre) {
    sql += ` nombre = ?,`
    values.push(nombre)
  }
  if (descripcion) {
    sql += ` descripcion = ?,`
    values.push(descripcion)
  }
  sql = sql.slice(0, -1)
  sql += ` WHERE idEquipo = ?`
  values.push(idEquipo)
  try {
    const [result] = await pool.execute(sql, values)
    res.status(200).json(result)
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: error.message })
  }
}
