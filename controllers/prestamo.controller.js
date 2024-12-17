import { pool } from '../db/db.js'

export const addPrestamo = async (req, res) => {
  const {
    idlaboratorio,
    idusuario,
    fecha,
    horainicio,
    duracion,
    observaciones,
    materiales
  } = req.body
  console.log(req.body)

  const connection = await pool.getConnection()

  try {
    await connection.beginTransaction()

    const prestamoValues = [
      idlaboratorio ?? null,
      idusuario ?? null,
      fecha ?? null,
      horainicio ?? null,
      duracion ?? null,
      observaciones ?? null
    ]

    // utilizar el procedimiento insertar_prestamo
    const prestamoSql =
      'CALL insertar_prestamo(?, ?, ?, ?, ?, ?, @resultado, @mensaje)'
    const [prestamoResult] = await connection.execute(
      prestamoSql,
      prestamoValues
    )

    const [result] = await connection.execute('SELECT @resultado, @mensaje')

    if (result[0]['@resultado'] === 0) {
      throw new Error(result[0]['@mensaje'])
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
      'SELECT pr.*, lab.departamento, lab.num_ed, lab.aula FROM prestamo pr JOIN laboratorio lab ON pr.idlaboratorio = lab.idlaboratorio WHERE idusuario = ?'
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
    horainicio,
    duracion,
    observaciones,
    estado
  } = req.body
  const fields = []
  const values = []
  if (idlaboratorio) {
    fields.push('idlaboratorio')
    values.push(idlaboratorio ?? null)
  }
  if (idusuario) {
    fields.push('idusuario')
    values.push(idusuario ?? null)
  }
  if (fecha) {
    fields.push('fecha')
    values.push(fecha ?? null)
  }
  if (horainicio) {
    fields.push('horainicio')
    values.push(horainicio ?? null)
  }
  if (duracion) {
    fields.push('duracion')
    values.push(duracion ?? null)
  }
  if (observaciones) {
    fields.push('observaciones')
    values.push(observaciones ?? null)
  }
  if (estado) {
    fields.push('estado')
    values.push(estado ?? null)
  }
  if (fields.length === 0) {
    res
      .status(400)
      .json({ status: 'error', message: 'No hay campos a actualizar' })
  }
  const sql = `UPDATE prestamo SET ${fields
    .map((field) => `${field} = ?`)
    .join(', ')} WHERE idprestamo = ?`
  console.log(sql)
  values.push(id)
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

export const resumenPrestamos = async (req, res) => {
  try {
    const sql = 'SELECT * FROM resumen_prestamo_por_laboratorio'
    const [result] = await pool.execute(sql)
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
