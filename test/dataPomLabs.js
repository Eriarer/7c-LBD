import 'dotenv/config'
import { pool } from '../db/db.js' //Importando la piscina de conexiones

const labs = [
  {
    plantel: 'Central',
    num_ed: 54,
    aula: 'A',
    departamento: 'Ciencias Exactas',
    cupo: 30,
    hora_inicio: '07:00:00',
    hora_cierre: '14:00:00',
    dias: 'Lu, Ma, Mi, Ju, Vi'
  },
  {
    plantel: 'Central',
    num_ed: 57,
    aula: 'A',
    departamento: 'Electronica',
    cupo: 25,
    hora_inicio: '13:00:00',
    hora_cierre: '20:00:00',
    dias: 'Lu, Ma, Mi, Ju, Vi'
  },
  {
    plantel: 'Central',
    num_ed: 57,
    aula: 'B',
    departamento: 'Electronica',
    cupo: 30,
    hora_inicio: '08:00:00',
    hora_cierre: '17:00:00',
    dias: 'Lu, Ma, Mi, Ju, Vi'
  },
  {
    plantel: 'Central',
    num_ed: 57,
    aula: 'C',
    departamento: 'Ciencias Exactas',
    cupo: 30,
    hora_inicio: '07:00:00',
    hora_cierre: '14:00:00',
    dias: 'Lu, Ma, Mi, Ju, Vi'
  },
  {
    plantel: 'Central',
    num_ed: 203,
    aula: 'C',
    departamento: 'Ciencias Exactas',
    cupo: 20,
    hora_inicio: '09:00:00',
    hora_cierre: '16:00:00',
    dias: 'Lu, Ma, Mi, Ju, Vi'
  },
  {
    plantel: 'Central',
    num_ed: 204,
    aula: 'D',
    departamento: 'Ciencias Exactas',
    cupo: 35,
    hora_inicio: '10:00:00',
    hora_cierre: '17:00:00',
    dias: 'Lu, Ma, Mi, Ju, Vi'
  }
]

//////////////////// INSERCIONES A LAS TABLAS ////////////////////
const insertLabs = async (plantel, num_ed, aula, departamento, cupo) => {
  const sqlLab =
    'INSERT INTO laboratorio (plantel,num_ed, aula, departamento,cupo) VALUES (?, ?, ?, ?, ?)'
  try {
    const result = await pool.query(sqlLab, [
      plantel,
      num_ed,
      aula,
      departamento,
      cupo
    ])
    if (result[0].affectedRows === 1) {
      console.log('Lab insertado')
    } else {
      console.log('Error en la insercion', result[0].message)
    }
  } catch (error) {
    console.error('Error en la insercion', error)
  }
}

const insertHorarioLabs = async (
  idlaboratorio,
  hora_inicio,
  hora_cierre,
  dias
) => {
  const sqlLab =
    'INSERT INTO horario_servicio (idlaboratorio,hora_inicio, hora_cierre, dias) VALUES (?, ?, ?, ?)'
  try {
    const result = await pool.query(sqlLab, [
      idlaboratorio,
      hora_inicio,
      hora_cierre,
      dias
    ])
    if (result[0].affectedRows === 1) {
      console.log('Horario Lab insertado')
    } else {
      console.log('Error en la insercion del Horario Lab', result[0].message)
    }
  } catch (error) {
    console.error('Error en la insercion Horario Lab', error)
  }
}

//////////////////// TRUNCATE DE LAS TABLAS ////////////////////

// Función para truncar la tabla horario_servicio
async function truncateHorarioServicio() {
  try {
    // Deshabilitar claves foráneas temporalmente
    await pool.query('SET FOREIGN_KEY_CHECKS = 0;')
    // Borrar datos de la tabla
    await pool.query('TRUNCATE TABLE horario_servicio;')
    // Rehabilitar claves foráneas
    await pool.query('SET FOREIGN_KEY_CHECKS = 1;')
    console.log('Tabla "horario_servicio" truncada exitosamente.')
  } catch (error) {
    console.error('Error truncando la tabla horario_servicio:', error)
  }
}

// Función para truncar la tabla laboratorio
async function truncateLaboratorio() {
  try {
    // Ejecutar TRUNCATE TABLE
    await pool.query('SET FOREIGN_KEY_CHECKS = 0;') // Deshabilitar claves foráneas temporalmente
    await pool.query('TRUNCATE TABLE laboratorio;') // Borrar datos
    await pool.query('SET FOREIGN_KEY_CHECKS = 1;') // Rehabilitar claves foráneas
    console.log('Tabla "laboratorio" truncada exitosamente.')
  } catch (error) {
    console.error('Error truncando la tabla laboratorio:', error)
  }
}

const randomInRangeDescending = (min, max) => {
  if (min < max) [min, max] = [max, min] // Intercambiar si min < max
  return Math.floor(Math.random() * (min - max + 1)) + max
}

async function getLastIdLab() {
  //Obtenidendo el id del último laboratorio
  const result = await pool.query(
    'SELECT MAX(CAST(idlaboratorio AS unsigned)) as id FROM laboratorio'
  )
  let last_id = result[0][0].id == null ? 1 : parseInt(result[0][0].id)
  console.log('Last id:', last_id)
  return last_id
}

//////////////////// MAIN ////////////////////
const main = async () => {
  // Eliminando los datos de las tablas antes de insertar nuevos datos
  await truncateHorarioServicio()
  await truncateLaboratorio()

  //Recorriendo el array de Labs para hacer la inserción
  for (const lab of labs) {
    const horaInt = randomInRangeDescending(7, 14) // Hora aleatoria entre 7 y 14
    const horaSI = String(horaInt).padStart(2, '0')
    const horaSF = String(horaInt + 7).padStart(2, '0') // Se suma 7 horas para la hora de fin

    const horaIni = `${horaSI}:00:00`
    const horaFin = `${horaSF}:00:00`

    // Llamar a insertLabs con los datos del laboratorio
    await insertLabs(
      lab.plantel,
      lab.num_ed,
      lab.aula,
      lab.departamento,
      lab.cupo
    )

    const idlaboratorio = await getLastIdLab() // Asegúrate de usar await aquí

    //Inserción de los horarios de los laboratorios
    await insertHorarioLabs(
      idlaboratorio,
      lab.hora_inicio,
      lab.hora_cierre,
      lab.dias
    )
  }

  await pool.query('SELECT * FROM laboratorio').then((result) => {
    console.log(result[0])
  })

  await pool.query('SELECT * FROM horario_servicio').then((result) => {
    console.log(result[0])
  })

  await pool.end()
}

main()
