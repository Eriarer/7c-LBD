import { pool } from '../db/db.js'

export const addLaboratorio = async (req, res) => {
    const {plantel, num_ed, aula, departamento, cupo} = req.body
    try {
        sql = `INSERT INTO laboratorio`
        let fields = ['plantel', 'num_ed', 'aula', 'departamento', 'cupo']
        let values = [plantel, num_ed, aula, departamento, cupo]
        sql += ` (${fields.join(', ')}) VALUES (${fields
            .map(() => '?')
            .join(', ')})`
        const [result] = await pool.execute(sql, values)
        res.status(201).json({status: 'success', message: 'Laboratorio agregado'})
    }
    catch (error) {
        console.log(error)
        res.status(500).json({status: 'error', message: error.message})
    }
}

export const getLaboratorios = async (req, res) => {
    try {
        const [result] = await pool.execute('SELECT * FROM laboratorio')
        res.status(200).json({status: 'success', data: result})
    }
    catch (error) {
        console.log(error)
        res.status(500).json({status: 'error', message: error.message})
    }
}

export const getLaboratorioById = async (req, res) => {
    const {id} = req.params
    try {
        const sql = `SELECT * FROM laboratorio WHERE idLaboratorio = ?`
        const [result] = await pool.execute(sql, [id])
        res.status(200).json(result)
    }
    catch (error) {
        console.log(error)
        res.status(500).json({status: 'error', message: error.message})
    }
}

export const deleteLaboratorio = async (req, res) => {
    const {id} = req.params
    try {
        const sql = `DELETE FROM laboratorio WHERE idLaboratorio = ?`
        const [result] = await pool.execute(sql, [id])
        res.status(200).json({status: 'success', message: 'Laboratorio eliminado'})
    }
    catch (error) {
        console.log(error)
        res.status(500).json({status: 'error', message: error.message})
    }
}

export const updateLaboratorio = async (req, res) => {
    const {idLaboratorio, plantel, num_ed, aula, departamento, cupo} = req.body
    let sql = `UPDATE laboratorio SET `
    const values = []
    if (plantel) {
        sql += ` plantel = ?,`
        values.push(plantel)
    }
    if (num_ed) {
        sql += ` num_ed = ?,`
        values.push(num_ed)
    }
    if (aula) {
        sql += ` aula = ?,`
        values.push(aula)
    }
    if (departamento) {
        sql += ` departamento = ?,`
        values.push(departamento)
    }
    if (cupo) {
        sql += ` cupo = ?,`
        values.push(cupo)
    }
    if (values.length === 0) {
        return res.status(400).json({status: 'error', message: 'Datos insuficientes'})
    }
    sql = sql.slice(0, -1)
    sql += ` WHERE idLaboratorio = ?`
    values.push(idLaboratorio)
    try {
        const [result] = await pool.execute(sql, values)
        res.status(200).json({status: 'success', message: 'Laboratorio actualizado'})
    }
    catch (error) {
        console.log(error)
        res.status(500).json({status: 'error', message: error.message})
    }
}
