import { pool } from '../db/db.js'

export const addUsuario = async (req, res) => {
  const { idusuario, tipo, nombre } = req.body
  try {
    const sql = `INSERT INTO usuario (idusuario, tipo, nombre) VALUES (?, ?, ?)`
    const [result] = await pool.query(sql, [idusuario, tipo, nombre])
    res.status(201).json(result)
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: error.message })
  }
}

export const deleteUsuarios = async (req, res) => {
  const { ids } = req.body
  try {
    const sql = `DELETE FROM usuario WHERE idusuario IN (?)`
    const [results] = await pool.query(sql, [ids])
    res.status(200).json(results)
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: error.message })
  }
}

export const deleteUsuario = async (req, res) => {
  const { id } = req.params
  try {
    const sql = `DELETE FROM usuario WHERE idusuario = ?`
    const [results] = await pool.query(sql, [id])
    res.status(200).json(results)
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: error.message })
  }
}

export const updateUsuario = async (req, res) => {
  const { id, newId, tipo, nombre } = req.body

  let sql = `UPDATE usuario SET `
  const values = []

  if (newId !== null && newId !== undefined) {
    sql += `idusuario = ?, `
    values.push(newId)
  }
  if (tipo !== null && tipo !== undefined) {
    sql += `tipo = ?, `
    values.push(tipo)
  }
  if (nombre !== null && nombre !== undefined) {
    sql += `nombre = ?, `
    values.push(nombre)
  }

  if (values.length === 0) {
    return res.status(400).json({ error: 'Request body is empty' })
  }

  sql = sql.slice(0, -2)
  sql += ` WHERE idusuario = ?`
  values.push(id)

  try {
    const [results] = await pool.query(sql, values)
    res.status(200).json(results)
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: error.message })
  }
}


export const getUsuarios = async (req, res) => {
  try {
    const [results] = await pool.query('SELECT * FROM usuario')
    res.status(200).json(results)
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: error.message })
  }
}

export const getUsuariosFiltered = async (req, res) => {
  const { idinf, idsup, nombre, tipo, cas_seneitive } = req.body
  try {
    let sql = `SELECT * FROM usuario WHERE `
    const values = []
    if (idinf) {
      sql += `lower(idusuario) >= lower(?) AND `
      values.push(idinf)
    }

    if (idsup) {
      sql += `lower(idusuario) <= lower(?) AND `
      values.push(idsup)
    }

    if (nombre) {
      if (cas_seneitive) sql += `nombre LIKE BINARY CONCAT('%', ?, '%') AND `
      else sql += `lower(nombre) LIKE CONCAT('%', lower(?), '%') AND `
      values.push(nombre)
    }
    if (tipo) {
      const tipos = tipo.split(',').map(tipo => tipo.trim())
      sql += `tipo IN (${tipos.map(() => '?').join(', ')}) AND `
      values.push(...tipos)
    }
    if (values.length !== 0) {
      sql = sql.slice(0, -4)
    } else {
      sql = sql.slice(0, -7)
    }
    sql += ` ORDER BY idusuario ASC`
    const [results] = await pool.query(sql, values)
    res.status(200).json(results)
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: error.message })
  }
}

export const getUsuarioById = async (req, res) => {
  const { id } = req.params
  try {
    const sql = `SELECT * FROM usuario WHERE idusuario = ?`
    const [results] = await pool.query(sql, [id])
    res.status(200).json(results)
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: error.message })
  }
}