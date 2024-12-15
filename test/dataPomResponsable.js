import 'dotenv/config'
import { pool } from '../db/db.js' //Importando la piscina de conexiones

const responsables = [
  { nombre: 'Ana López', tipo: 'E', activo: 1 },
  { nombre: 'Juan Pérez', tipo: 'E', activo: 1 },
  { nombre: 'María García', tipo: 'E', activo: 1 },
  { nombre: 'Carlos Martínez', tipo: 'E', activo: 0 },
  { nombre: 'Luisa Fernández', tipo: 'E', activo: 1 },
  { nombre: 'Pedro González', tipo: 'E', activo: 0 },
  { nombre: 'Sofía Ramírez', tipo: 'E', activo: 1 },
  { nombre: 'Miguel Torres', tipo: 'E', activo: 1 },
  { nombre: 'Gabriela Cruz', tipo: 'E', activo: 0 },
  { nombre: 'Fernando Soto', tipo: 'E', activo: 1 },
  { nombre: 'Isabel Morales', tipo: 'E', activo: 1 },
  { nombre: 'Ricardo Vargas', tipo: 'P', activo: 1 },
  { nombre: 'Carmen Díaz', tipo: 'P', activo: 1 },
  { nombre: 'Héctor Chávez', tipo: 'P', activo: 0 },
  { nombre: 'Patricia Silva', tipo: 'A', activo: 1 },
  { nombre: 'Raúl Méndez', tipo: 'A', activo: 0 },
  { nombre: 'Lorena Reyes', tipo: 'A', activo: 1 },
  { nombre: 'Jorge Herrera', tipo: 'A', activo: 1 },
  { nombre: 'Fabiola Castro', tipo: 'E', activo: 1 },
  { nombre: 'Diego Sánchez', tipo: 'E', activo: 1 },
  { nombre: 'Carla Medina', tipo: 'E', activo: 0 },
  { nombre: 'Esteban Vega', tipo: 'E', activo: 1 },
  { nombre: 'Verónica Orozco', tipo: 'E', activo: 1 },
  { nombre: 'Natalia Rojas', tipo: 'E', activo: 1 },
  { nombre: 'Ángel Navarro', tipo: 'E', activo: 1 },
  { nombre: 'Camila Ortiz', tipo: 'E', activo: 1 },
  { nombre: 'Gustavo Paredes', tipo: 'E', activo: 0 },
  { nombre: 'Andrea Delgado', tipo: 'E', activo: 1 },
  { nombre: 'David Zamora', tipo: 'E', activo: 1 }
]

const getRandomNumber = () => {
  return Math.floor(100000 + Math.random() * 900000)
}

const startId = getRandomNumber()

responsables.forEach((responsable, index) => {
  const idresponsable = startId + index
  console.log(
    `INSERT INTO lab_managment.responsable (idresponsable, nombre, tipo, activo) VALUES ('${idresponsable}', '${responsable.nombre}', '${responsable.tipo}', ${responsable.activo});`
  )
})

//////////////////// INSERCIONES A LAS TABLAS ////////////////////
//Función para insertar un responsable
const insertResponsable = async (idresponsable, nombre, tipo, activo) => {
  const sql =
    'INSERT INTO responsable (idresponsable, nombre, tipo, activo) VALUES (?, ?, ?, ?)'
  try {
    const result = await pool.query(sql, [idresponsable, nombre, tipo, activo])
    if (result[0].affectedRows === 1) {
      console.log('Responsable insertado', nombre)
    } else {
      console.log('Error en la insercion', result[0].message)
    }
  } catch (error) {
    console.error('Error en la insercion', error)
  }
}

//////////////Funciones para insertar en la tabla de lab_res

// Función para insertar responsables en la tabla de lab_res
const insertLabResponsables = async () => {
  try {
    // Obtener los laboratorios
    const [laboratorios] = await pool.query(
      'SELECT idlaboratorio FROM laboratorio'
    )

    // Obtener responsables de tipo 'E' y activos
    const [responsablesE] = await pool.query(
      'SELECT idresponsable FROM responsable WHERE tipo = "E" AND activo = 1'
    )

    // Obtener responsables de tipo 'A' y activos (opcional)
    const [responsablesA] = await pool.query(
      'SELECT idresponsable FROM responsable WHERE tipo = "A" AND activo = 1'
    )

    // Verificar si hay responsables de tipo 'E' disponibles
    if (responsablesE.length === 0) {
      console.log('No hay responsables de tipo E activos')
      return
    }

    // Mantener un registro de los responsables asignados
    const responsablesAsignados = new Set()

    // Asignar responsables a los laboratorios
    for (let laboratorio of laboratorios) {
      // Seleccionar un responsable de tipo 'E' aleatorio, asegurándonos de que no esté asignado a otro laboratorio
      const responsableE = responsablesE.find(
        (r) => !responsablesAsignados.has(r.idresponsable)
      )
      if (responsableE) {
        await insertLabRes(
          laboratorio.idlaboratorio,
          responsableE.idresponsable
        )
        responsablesAsignados.add(responsableE.idresponsable)
      }

      // Si hay responsables de tipo 'A', asignar uno también (asegurándonos de que no esté asignado a otro laboratorio)
      if (responsablesA.length > 0) {
        const responsableA = responsablesA.find(
          (r) => !responsablesAsignados.has(r.idresponsable)
        )
        if (responsableA) {
          await insertLabRes(
            laboratorio.idlaboratorio,
            responsableA.idresponsable
          )
          responsablesAsignados.add(responsableA.idresponsable)
        }
      }
    }

    console.log('Asignaciones completadas exitosamente.')
  } catch (error) {
    console.error(
      'Error en la inserción de responsables a laboratorios:',
      error
    )
  }
}

// Función para insertar la relación entre el laboratorio y el responsable
const insertLabRes = async (idlaboratorio, idresponsable) => {
  const sql = 'INSERT INTO lab_res (idlaboratorio, idresponsable) VALUES (?, ?)'
  try {
    const result = await pool.query(sql, [idlaboratorio, idresponsable])
    if (result[0].affectedRows === 1) {
      console.log(
        `Responsable ${idresponsable} asignado al laboratorio ${idlaboratorio}`
      )
    } else {
      console.log('Error al asignar responsable', result[0].message)
    }
  } catch (error) {
    console.error('Error al insertar en la tabla lab_res:', error)
  }
}

//////////////////// TRUNCATE DE LAS TABLAS ////////////////////
//Truncando la tabla de responsables
const truncateResponsable = async () => {
  try {
    await pool.query('SET FOREIGN_KEY_CHECKS = 0;')
    await pool.query('TRUNCATE TABLE responsable;')
    await pool.query('SET FOREIGN_KEY_CHECKS = 1;')
    console.log("Tabla 'responsable' truncada exitosamente.")
  } catch (error) {
    console.error('Error truncando la tabla responsable:', error)
  }
}

//Truncando la tabla de responsables
const truncateLab_res = async () => {
  try {
    await pool.query('SET FOREIGN_KEY_CHECKS = 0;')
    await pool.query('TRUNCATE TABLE lab_res;')
    await pool.query('SET FOREIGN_KEY_CHECKS = 1;')
    console.log("Tabla 'lab_res' truncada exitosamente.")
  } catch (error) {
    console.error('Error truncando la tabla responsable:', error)
  }
}

//////////////////// MAIN ////////////////////
const main = async () => {
  await truncateResponsable()
  await truncateLab_res()

  const startId = getRandomNumber()
  //Insertando los responsables en la tabla
  responsables.forEach(async (responsable, index) => {
    const idresponsable = startId + index
    await insertResponsable(
      idresponsable,
      responsable.nombre,
      responsable.tipo,
      responsable.activo
    )
  })

  // Ejecutar la inserción en lab_res
  insertLabResponsables()
}

main()
