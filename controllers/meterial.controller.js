import { pool } from '../db/db.js'

export const addMateriales = async (req, res) => {
    const { idprestamo, idlaboratorio, idunidad, cantidad} = req.body
    try {
        sql = `INSERT INTO materiales`
        let fields = ['idprestamo', 'idlaboratorio', 'idunidad', 'cantidad']
        let values = [idprestamo, idlaboratorio, idunidad, cantidad]
        sql += ` (${fields.join(', ')}) VALUES (${fields
            .map(() => '?')
            .join(', ')})`
        const [result] = await pool.execute(sql, values)
        res.status(201).json({status: 'success', message: 'Material agregado'})
    }
    catch (error) {
        console.log(error)
        res.status(500).json({status: 'error', message: error.message})
    }
}

export const getMateriales = async (req, res) => {
    try {
        const [result] = await pool.execute('SELECT * FROM materiales')
        res.status(200).json({status: 'success', data: result})
    }
    catch (error) {
        console.log(error)
        res.status(500).json({status: 'error', message: error.message})
    }
}

export const getMaterialById = async (req, res) => {
    const {id} = req.params
    try {
        const sql = `SELECT * FROM materiales WHERE idprestamo = ? AND idlaboratorio = ? AND idunidad = ?`
        const [result] = await pool.execute(sql, [idprestamo, idlaboratorio, idunidad])
        res.status(200).json(result)
    }
    catch (error) {
        console.log(error)
        res.status(500).json({ error: error.message })
    }
}

export const deleteMaterial = async (req, res) => {
    const {idprestamo, idlaboratorio, idunidad} = req.params
    try {
        const sql = `DELETE FROM materiales WHERE idprestamo = ? AND idlaboratorio = ? AND idunidad = ?`
        const [result] = await pool.execute(sql, [idprestamo, idlaboratorio, idunidad])
        res.status(200).json(result)
    }
    catch (error) {
        console.log(error)
        res.status(500).json({ error: error.message })
    }
}
