import { pool } from '../db/db.js'

export const addUsuario = async (req, res) => {
  const { idusuario, nombre, apellido, carrera, correo, tipo, activo } =
    req.body

  let sql = 'INSERT INTO usuario'
  let fields = ['idusuario', 'nombre', 'correo']
  let values = [idusuario, nombre, correo]

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
    if (!result || result.affectedRows === 0)
      res
        .status(400)
        .json({ status: 'error', message: 'No se pudo agregar el usuario' })

    res.status(201).json({ status: 'success', message: 'Usuario creado' })
  } catch (error) {
    console.log(error)
    res.status(500).json({ status: 'error', message: error.message })
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
    res.status(500).json({ status: 'error', message: error.message })
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
    res.status(500).json({ status: 'error', message: error.message })
  }
}

export const getUsuarios = async (req, res) => {
  try {
    const [results] = await pool.query('SELECT * FROM usuario')
    if (results.length === 0)
      res.status(404).json({ status: 'error', message: 'No hay usuarios' })
    res.status(200).json({ status: 'success', data: results })
  } catch (error) {
    console.log(error)
    res.status(500).json({ status: 'error', message: error.message })
  }
}

export const getUsuarioById = async (req, res) => {
  const { id } = req.params
  try {
    const sql = 'SELECT * FROM usuario WHERE idusuario = ?'
    const [results] = await pool.query(sql, [id])
    if (result.length === 0)
      res
        .status(400)
        .json({ status: 'error', message: 'Usuario no encontrado' })
    res.status(200).json({ status: 'success', data: results[0] })
  } catch (error) {
    console.log(error)
    res.status(500).json({ status: 'error', message: error.message })
  }
}
