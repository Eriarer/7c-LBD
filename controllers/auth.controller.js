import argon2 from 'argon2'
import { pool } from '../db/db.js'
import { generateToken } from '../middleware/jwt.middleware.js'

export const login = async (req, res) => {
  const { correo, password } = req.body
  try {
    const [results] = await pool.query(
      'SELECT * FROM usuario WHERE correo = ?',
      [correo]
    )
    if (results.length === 0) {
      return res.status(400).json({ error: 'Correo o contraseña incorrecta' })
    }
    if (results[0].activo == 0) {
      return res.status(400).json({
        error: 'No puedes ingresar con esta cuenta, esta desactivada.'
      })
    }
    if (!(await argon2.verify(results[0].password, password))) {
      return res.status(400).json({ error: 'Correo o contraseña incorrecta' })
    }
    const token = generateToken(results[0])
    const data = {
      idusuario: results[0].idusuario,
      nombre: results[0].nombre,
      apellido: results[0].apellido,
      carrera: results[0].carrera,
      correo: results[0].correo,
      tipo: results[0].tipo
    }
    res.status(200).json({ status: 'success', token, data: data })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      status: 'error',
      message: 'Algo ah salido mal, intentalo más tarde'
    })
  }
}

export const readToken = (req, res) => {
  const { idusuario, nombre, apellido, correo, tipo } = req.user
  if (!idusuario || !nombre || !correo || !tipo) {
    return res.status(403).json({
      status: 'error',
      message: 'Authenticación fallida'
    })
  }

  res.status(200).json({
    status: 'success',
    data: { idusuario, nombre, apellido, correo, tipo }
  })
}

export const regenerateToken = (req, res) => {
  const { idusuario, nombre, apellido, correo, tipo } = req.user
  if (!idusuario || !nombre || !correo || !tipo) {
    return res.status(403).json({
      status: 'error',
      message: 'Authenticación fallida'
    })
  }
  const data = { idusuario, nombre, apellido, correo, tipo }
  const token = generateToken(data)
  res.status(200).json({ status: 'success', token, data: data })
}
