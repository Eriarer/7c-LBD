import argon2 from 'argon2'
import { pool } from '../db/db.js'

export const addUsuario = async (req, res) => {
  const {
    idusuario,
    nombre,
    apellido,
    carrera,
    correo,
    password,
    tipo,
    activo
  } = req.body

  const hasedPassword = await argon2.hash(password)

  let sql = 'INSERT INTO usuario'
  const fields = ['idusuario', 'nombre', 'correo', 'password']
  const values = [idusuario, nombre, correo, hasedPassword]

  if (apellido) {
    fields.push('apellido')
    values.push(apellido)
  }
  if (carrera) {
    fields.push('carrera')
    values.push(carrera)
  }
  if (tipo) {
    fields.push('tipo')
    values.push(tipo)
  }
  if (activo) {
    fields.push('activo')
    values.push(activo)
  }
  sql += ` (${fields.join(', ')}) VALUES (${fields.map(() => '?').join(', ')})`
  try {
    const [result] = await pool.query(sql, values)
    if (!result || result.affectedRows === 0) {
      res
        .status(400)
        .json({ status: 'error', message: 'No se pudo agregar el usuario' })
    }

    res.status(201).json({ status: 'success', message: 'Usuario creado' })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      status: 'error',
      message: 'Algo ah salido mal, intentalo más tarde'
    })
  }
}

export const deleteUsuario = async (req, res) => {
  const { id } = req.params
  try {
    const sql = 'DELETE FROM usuario WHERE idusuario = ?'
    const [results] = await pool.query(sql, [id])

    if (!results || results.affectedRows === 0) {
      throw new Error('Hubo un error al eliminar el usuario')
    }
    res.status(200).json({ status: 'success', message: 'Usuario eliminado' })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      status: 'error',
      message: 'Algo ah salido mal, intentalo más tarde'
    })
  }
}

export const updateUsuario = async (req, res) => {
  const { id } = req.params
  const { newId, nombre, apellido, carrera, correo, tipo, activo } = req.body
  const values = []
  const fields = []
  if (newId) {
    fields.push('idusuario = ?')
    values.push(newId)
  }
  if (nombre) {
    fields.push('nombre = ?')
    values.push(nombre)
  }
  if (apellido) {
    fields.push('apellido = ?')
    values.push(apellido)
  }
  if (carrera) {
    fields.push('carrera = ?')
    values.push(carrera)
  }
  if (correo) {
    fields.push('correo = ?')
    values.push(correo)
  }
  if (tipo) {
    fields.push('tipo = ?')
    values.push(tipo)
  }
  if (activo) {
    fields.push('activo = ?')
    values.push(activo === 'true' ? 1 : 0)
  }
  if (values.length === 0) {
    return res.status(400).json({ error: 'Datos insuficientes' })
  }

  if (!id) return res.status(400).json({ error: 'Id es requerido' })

  values.push(id)

  const sql = `UPDATE usuario SET ${fields.join(', ')} WHERE idusuario = ?`

  try {
    const [results] = await pool.query(sql, values)

    if (!results || results.affectedRows === 0) {
      throw new Error('Hubo un error al actualizar el usuario')
    }
    res.status(200).json({ status: 'success', message: 'Usuario actualizado' })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      status: 'error',
      message: 'Algo ah salido mal, intentalo más tarde'
    })
  }
}

export const updatePassword = async (req, res) => {
  const { id } = req.params
  const { password, newPassword } = req.body

  try {
    const [oldPassword] = await pool.query(
      'SELECT password FROM usuario WHERE idusuario = ?',
      [id]
    )
    if (oldPassword.length === 0) {
      return res.status(400).json({ error: 'Usuario no encontrado' })
    }
    if (!(await argon2.verify(oldPassword[0].password, password))) {
      return res.status(400).json({ error: 'Contraseña incorrecta' })
    }
  } catch (error) {
    console.log(error)
    return res
      .status(500)
      .json({ error: 'Algo ah salido mal, intentalo más tarde' })
  }

  const hashedPassword = await argon2.hash(newPassword)

  try {
    const [results] = await pool.query(
      'UPDATE usuario SET password = ? WHERE idusuario = ?',
      [hashedPassword, id]
    )

    if (!results || results.affectedRows === 0) {
      throw new Error('Hubo un error al actualizar la contraseña')
    }
    res
      .status(200)
      .json({ status: 'success', message: 'Contraseña actualizada' })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      status: 'error',
      message: 'Algo ah salido mal, intentalo más tarde'
    })
  }
}

export const getUsuarios = async (req, res) => {
  try {
    const [results] = await pool.query(
      'SELECT idusuario, nombre, apellido, carrera, correo, tipo, activo FROM usuario'
    )
    if (results.length === 0) {
      res.status(404).json({ status: 'error', message: 'No hay usuarios' })
    }
    res.status(200).json({ status: 'success', data: results })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      status: 'error',
      message: 'Algo ah salido mal, intentalo más tarde'
    })
  }
}

export const getUsuarioById = async (req, res) => {
  const { id } = req.params
  try {
    const sql =
      'SELECT idusuario, nombre, apellido, carrera, correo, tipo, activo FROM usuario WHERE idusuario = ?'
    const [results] = await pool.query(sql, [id])
    if (results.length === 0) {
      res
        .status(400)
        .json({ status: 'error', message: 'Usuario no encontrado' })
    }
    res.status(200).json({ status: 'success', data: results })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      status: 'error',
      message: 'Algo ah salido mal, intentalo más tarde'
    })
  }
}
