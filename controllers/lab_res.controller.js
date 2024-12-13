import { pool } from '../db/db.js'

export const addLabRes = async (req, res) => {
    const { idlaboratorio, idresponsable } = req.body
    try {
        let sql = 'INSERT INTO laboratorio_responsable'
        let fields = ['idlaboratorio', 'idresponsable']
        let values = [idlaboratorio, idresponsable]
        sql += ` (${fields.join(', ')}) VALUES (${fields
            .map(() => '?')
            .join(', ')})`
        const [result] = await pool.execute(sql, values)
        res.status(201).json({status: 'success', message: 'Relación laboratorio-responsable agregada'})
    } catch (error) {
        console.log(error)
        res.status(500).json({status: 'error', message: error.message})
    }
}

export const getLabRes = async (req, res) => {
    try {
        const [result] = await pool.execute('SELECT * FROM laboratorio_responsable')
        if (result.length === 0) {
            return res.status(404).json({status: 'error', message: 'No hay relaciones laboratorio-responsable'})
        }
        res.status(200).json({status: 'success', data: result})
    } catch (error) {
        console.log(error)
        res.status(500).json({status: 'error', message: error.message})
    }
}

export const getLabResById = async (req, res) => {
    const { idlaboratorio, idresponsable } = req.params
    try {
        const sql = `SELECT * FROM laboratorio_responsable WHERE idlaboratorio = ? AND idresponsable = ?`
        const [result] = await pool.execute(sql, [idlaboratorio, idresponsable])
        res.status(200).json(result)
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: error.message })
    }
}

export const deleteLabRes = async (req, res) => {
    const { idlaboratorio, idresponsable } = req.params
    try {
        const sql = `DELETE FROM laboratorio_responsable WHERE idlaboratorio = ? AND idresponsable = ?`
        const [result] = await pool.execute(sql, [idlaboratorio, idresponsable])
        res.status(200).json(result)
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: error.message })
    }
}