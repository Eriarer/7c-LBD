import { pool } from '../db/db.js'

export const addPrestamo = async (req, res) => {
    const { idlaboratorio, idusuario, fecha, horaInicio, duracion, estado } = req.body
    try {
        let sql = 'INSERT INTO prestamo'
        let fields = ['idlaboratorio', 'idusuario', 'fecha', 'horaInicio', 'duracion', 'estado']
        let values = [idlaboratorio, idusuario, fecha, horaInicio, duracion, estado]
        if (observaciones) {
            fields.push('observaciones')
            values.push(observaciones)
        }
        sql += ` (${fields.join(', ')}) VALUES (${fields
            .map(() => '?')
            .join(', ')})`
        const [result] = await pool.execute(sql, values)
        res.status(201).json({status: 'success', message: 'Préstamo agregado'})
    }
    catch (error) {
        console.log(error)
        res.status(500).json({status: 'error', message: error.message})
    }
}

export const getPrestamos = async (req, res) => {
    try {
        const [result] = await pool.execute('SELECT * FROM prestamo')
        res.status(200).json({status: 'success', data: result})
    }
    catch (error) {
        console.log(error)
        res.status(500).json({status: 'error', message: error.message})
    }
}

export const getPrestamoById = async (req, res) => {
    const {id} = req.params
    try {
        const sql = `SELECT * FROM prestamo WHERE idprestamo = ?`
        const [result] = await pool.execute(sql, [id])
        res.status(200).json(result)
    }
    catch (error) {
        console.log(error)
        res.status(500).json({ error: error.message })
    }
}

export const deletePrestamo = async (req, res) => {
    const {id} = req.params
    try {
        const sql = `DELETE FROM prestamo WHERE idprestamo = ?`
        const [result] = await pool.execute(sql, [id])
        res.status(200).json(result)
    }
    catch (error) {
        console.log(error)
        res.status(500).json({ error: error.message })
    }
}

