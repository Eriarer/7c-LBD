import { pool } from '../db/db.js'

export const addHorarioProfesor = async (req, res) => {
    const { idprofesor, hora_inicio, hora_cierre, dias } = req.body
    try {
        let sql = 'INSERT INTO horario_profesor'
        let fields = ['idusuario', 'idlaboratorio', 'hora_inicio', 'hora_cierre', 'dias']
        if (descripcion) {
            fields.push('descripcion')
            values.push(descripcion)
        }
        let values = [idprofesor, hora_inicio, hora_cierre, dias]
        sql += ` (${fields.join(', ')}) VALUES (${fields
            .map(() => '?')
            .join(', ')})`
        const [result] = await pool.execute(sql, values)
        res.status(201).json({status: 'success', message: 'Horario de profesor agregado'})
    }
    catch (error) {
        console.log(error)
        res.status(500).json({status: 'error', message: error.message})
    }
}

export const getHorariosProfesores = async (req, res) => {
    try {
        const [result] = await pool.execute('SELECT * FROM horario_profesor')
        if (result.length === 0) {
            return res.status(404).json({status: 'error', message: 'No hay horarios de profesores'})
        }
        res.status(200).json({status: 'success', data: result})
    }
    catch (error) {
        console.log(error)
        res.status(500).json({status: 'error', message: error.message})
    }
}

export const getHorarioProfesor = async (req, res) => {
    const { id } = req.params
    try {
        const [result] = await pool.execute('SELECT * FROM horario_profesor WHERE idhorario = ?', [id])
        if (result.length === 0) {
            return res.status(404).json({status: 'error', message: 'Horario de profesor no encontrado'})
        }
        res.status(200).json({status: 'success', data: result[0]})
    }
    catch (error) {
        console.log(error)
        res.status(500).json({status: 'error', message: error.message})
    }
}

export const updateHorarioProfesor = async (req, res) => {
    const { id } = req.params
    const { idprofesor, hora_inicio, hora_cierre, dias } = req.body
    try {
        let sql = 'UPDATE horario_profesor SET '
        let fields = ['idprofesor', 'hora_inicio', 'hora_cierre', 'dias']
        let values = [idprofesor, hora_inicio, hora_cierre, dias]
        sql += fields.map((field, index) => `${field} = ?`).join(', ')
        values.push(id)
        sql += ' WHERE idhorario = ?'
        await pool.execute(sql, values)
        res.status(200).json({status: 'success', message: 'Horario de profesor actualizado'})
    }
    catch (error) {
        console.log(error)
        res.status(500).json({status: 'error', message: error.message})
    }
}

export const deleteHorarioProfesor = async (req, res) => {
    const { id } = req.params
    try {
        const [result] = await pool.execute('DELETE FROM horario_profesor WHERE idhorario = ?', [id])
        res.status(200).json({status: 'success', message: 'Horario de profesor eliminado'})
    }
    catch (error) {
        console.log(error)
        res.status(500).json({status: 'error', message: error.message})
    }
}