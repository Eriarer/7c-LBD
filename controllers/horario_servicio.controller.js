import { pool } from '../db/db.js'

export const addHorarioServicio = async (req, res) => {
    const { idlaboratorio, hora_inicio, hora_cierre, dias } = req.body
    try {
        let sql = 'INSERT INTO horario_servicio'
        let fields = ['idlaboratorio', 'hora_inicio', 'hora_cierre', 'dias']
        let values = [idlaboratorio, hora_inicio, hora_cierre, dias]
        sql += ` (${fields.join(', ')}) VALUES (${fields
            .map(() => '?')
            .join(', ')})`
        const [result] = await pool.execute(sql, values)
        res.status(201).json({status: 'success', message: 'Horario de servicio agregado'})
    }
    catch (error) {
        console.log(error)
        res.status(500).json({status: 'error', message: error.message})
    }
}

export const getHorariosServicio = async (req, res) => {
    try {
        const [result] = await pool.execute('SELECT * FROM horario_servicio')
        if (result.length === 0) {
            return res.status(404).json({status: 'error', message: 'No hay horarios de servicio'})
        }
        res.status(200).json({status: 'success', data: result})
    }
    catch (error) {
        console.log(error)
        res.status(500).json({status: 'error', message: error.message})
    }
}

export const getHorarioServicioById = async (req, res) => {
    const { idlaboratorio, hora_inicio, hora_cierre, dias } = req.params
    try {
        const sql = `SELECT * FROM horario_servicio WHERE idhorario_servicio = ?`
        const [result] = await pool.execute(sql, [idlaboratorio, hora_inicio, hora_cierre, dias])
        res.status(200).json(result)
    }
    catch (error) {
        console.log(error)
        res.status(500).json({ error: error.message })
    }
}

export const deleteHorarioServicio = async (req, res) => {
    const { idlaboratorio, hora_inicio, hora_cierre, dias } = req.params
    try {
        const sql = `DELETE FROM horario_servicio WHERE idhorario_servicio = ?`
        const [result] = await pool.execute(sql, [idlaboratorio, hora_inicio, hora_cierre, dias])
        res.status(200).json(result)
    }
    catch (error) {
        console.log(error)
        res.status(500).json({ error: error.message })
    }
}
