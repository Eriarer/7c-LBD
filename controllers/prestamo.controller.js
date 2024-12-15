import { pool } from '../db/db.js'

export const addPrestamo = async (req, res) => {
  const {
    idlaboratorio,
    idusuario,
    fecha,
    horaInicio,
    duracion,
    observaciones,
    estado,
    materiales
  } = req.body

  const connection = await pool.getConnection()

  try {
    await connection.beginTransaction()

    const prestamoFields = [
      'idlaboratorio',
      'idusuario',
      'fecha',
      'horaInicio',
      'duracion',
      'estado'
    ]
    const prestamoValues = [
      idlaboratorio,
      idusuario,
      fecha,
      horaInicio,
      duracion,
      estado
    ]

    if (observaciones) {
      prestamoFields.push('observaciones')
      prestamoValues.push(observaciones)
    }

    // utilizar el procedimiento insertar_prestamo
    const prestamoSql = `CALL insertar_prestamo(${prestamoFields
      .map(() => '?')
      .join(', ')})`
    const [prestamoResult] = await connection.execute(
      prestamoSql,
      prestamoValues
    )

    if (prestamoResult.affectedRows === 0) {
      throw new Error('No se pudo agregar el préstamo')
    }

    const idPrestamo = prestamoResult.insertId

    if (!materiales || materiales.length === 0) {
      await connection.commit()
      res.status(201).json({
        status: 'success',
        message: 'Préstamo agregado exitosamente'
      })
    } else {
      const materialSql =
        'INSERT INTO material (idprestamo, idlaboratorio, idunidad, cantidad) VALUES (?, ?, ?, ?)'

      for (const material of materiales) {
        const { idunidad, cantidad } = material

        if (!idunidad || !cantidad) {
          throw new Error('Datos de material incompletos')
        }

        await connection.execute(materialSql, [
          idPrestamo,
          idlaboratorio,
          idunidad,
          cantidad
        ])
      }

      // Confirma la transacción
      await connection.commit()

      res.status(201).json({
        status: 'success',
        message: 'Préstamo y materiales agregados exitosamente'
      })
    }
  } catch (error) {
    // Realiza un rollback si ocurre algún error
    await connection.rollback()
    console.error(error)
    res.status(500).json({
      status: 'error',
      message: error.message || 'Algo salió mal, inténtalo más tarde'
    })
  } finally {
    // Libera la conexión
    connection.release()
  }
}

export const getPrestamos = async (req, res) => {
  try {
    const [result] = await pool.execute('SELECT * FROM prestamo')
    if (result.length === 0) {
      res.status(404).json({ status: 'error', message: 'No hay prestamos' })
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

export const getPrestamoById = async (req, res) => {
  const { id } = req.params
  try {
    const sql = 'SELECT * FROM prestamo WHERE idprestamo = ?'
    const [result] = await pool.execute(sql, [id])
    if (result.length === 0) {
      res
        .status(404)
        .json({ status: 'error', message: 'Prestamos no encontrado' })
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

export const getPrestamoByIdUsuario = async (req, res) => {
  const { idusuario } = req.params
  try {
    const sql =
      'SELECT pr.*, lab.num_ed, lab.aula FROM prestamo pr JOIN laboratorio lab ON pr.idlaboratorio = lab.idlaboratorio WHERE idusuario = ?'
    const [result] = await pool.execute(sql, [idusuario])
    if (result.length === 0) {
      res
        .status(404)
        .json({ status: 'error', message: 'Prestamos no encontrado' })
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

export const deletePrestamo = async (req, res) => {
  const { id, estado } = req.params
  const estados = ['C', 'D', 'F']
  if (!estados.includes(estado)) {
    res.status(400).json({ status: 'error', message: 'Estado inválido' })
  }
  try {
    const sql = 'UPDATE prestamo SET estado = ? WHERE idprestamo = ?'
    const [result] = await pool.execute(sql, [estado, id])
    if (result.affectedRows === 0) {
      res
        .status(400)
        .json({ status: 'error', message: 'No se pudo eliminar el equipo' })
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

export const updatePrestamo = async (req, res) => {
  const { id } = req.params
  const {
    idlaboratorio,
    idusuario,
    fecha,
    horaInicio,
    duracion,
    observaciones,
    estado
  } = req.body
  const fields = []
  const values = []
  if (idlaboratorio) {
    fields.push('idlaboratorio = ?')
    values.push(idlaboratorio)
  }
  if (idusuario) {
    fields.push('idusuario = ?')
    values.push(idusuario)
  }
  if (fecha) {
    fields.push('fecha = ?')
    values.push(fecha)
  }
  if (horaInicio) {
    fields.push('horaInicio = ?')
    values.push(horaInicio)
  }
  if (duracion) {
    fields.push('duracion = ?')
    values.push(duracion)
  }
  if (observaciones) {
    fields.push('observaciones = ?')
    values.push(observaciones)
  }
  if (estado) {
    fields.push('estado = ?')
    values.push(estado)
  }
  values.push(id)
  const sql = `UPDATE prestamo SET ${fields.join(', ')} WHERE idprestamo = ?`
  try {
    const [result] = await pool.execute(sql, values)
    if (result.affectedRows === 0) {
      res
        .status(400)
        .json({ status: 'error', message: 'No se pudo actualizar el prestamo' })
    }
    res.status(200).json({ status: 'success', message: 'Prestamo actualizado' })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      status: 'error',
      message: 'Algo ah salido mal, intentalo más tarde'
    })
  }
}
