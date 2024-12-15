import 'dotenv/config'
import { pool } from '../db/db.js' //Importando la piscina de conexiones

const nombres = [
  'Juan',
  'Pedro',
  'Maria',
  'Ana',
  'Jose',
  'Luis',
  'Carlos',
  'Jorge',
  'Miguel',
  'Rosa'
]
const apellido = [
  'Gomez',
  'Perez',
  'Rodriguez',
  'Gonzalez',
  'Fernandez',
  'Lopez',
  'Diaz',
  'Martinez',
  'Sanchez',
  'Ramirez'
]
const carrera = [
  'Sistemas',
  'Industrial',
  'Civil',
  'Electronica',
  'Mecanica',
  'Quimica',
  'Biomedica',
  'Mecatronica',
  'Gestion',
  'Ambiental'
]
const tipo = ['A', 'M', 'E']

const getRandomElement = (array) => {
  const randomIndex = Math.floor(Math.random() * array.length)
  return array[randomIndex]
}

const generateEmail = (nombre, apellido) => {
  return `${nombre.toLowerCase()}.${apellido.toLowerCase()}@gmail.com`
}

//Función para dar un número aleatorio de 6 dígitos
const getRandomNumber = () => {
  return Math.floor(100000 + Math.random() * 900000)
}

const insertUser = async (
  id,
  nombre,
  apellido,
  carrera,
  correo,
  tipo,
  activo
) => {
  const sql =
    'INSERT INTO usuario (idusuario, nombre, apellido, carrera, correo, tipo, activo) VALUES (?, ?, ?, ?, ?, ?, ?)'
  try {
    const result = await pool.query(sql, [
      id,
      nombre,
      apellido,
      carrera,
      correo,
      tipo,
      activo
    ])
    if (result[0].affectedRows === 1) {
      console.log('Usuario insertado', id)
    } else {
      console.log('Error en la insercion', result[0].message)
    }
  } catch (error) {
    console.error('Error en la insercion', error)
  }
}

const main = async () => {
  const result = await pool.query(
    'SELECT MAX(CAST(idusuario AS unsigned)) as id FROM usuario'
  )
  console.log(result)
  const last_id =
    result[0][0].id == null
      ? await getRandomNumber()
      : parseInt(result[0][0].id) + 1
  const paro = last_id + 50
  console.log('Last id:', last_id)
  for (let i = last_id; i < paro; i++) {
    const nombre = getRandomElement(nombres)
    const apellidos = getRandomElement(apellido)
    const carreras = getRandomElement(carrera)
    const correos = generateEmail(nombre, apellidos)
    const tipos = getRandomElement(tipo)
    const activo = Math.random() > 0.25 ? true : false
    await insertUser(i, nombre, apellidos, carreras, correos, tipos, activo)
  }

  await pool.query('SELECT * FROM usuario').then((result) => {
    console.log(result[0])
  })

  await pool.end()
}

main()
