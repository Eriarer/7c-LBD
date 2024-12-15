import 'dotenv/config'
import axios from 'axios'
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
const tipo = ['ALUMNO', 'MAESTRO', 'EXTERNO', 'RESPONSABLE', 'AYUDANTE']

const getRandomElement = (array) => {
  const randomIndex = Math.floor(Math.random() * array.length)
  return array[randomIndex]
}

const generateEmail = (nombre, apellido) => {
  return `${nombre.toLowerCase()}.${apellido.toLowerCase()}@localhost.com`
}

//Función para dar un número aleatorio de 6 dígitos
const getRandomNumber = () => {
  return Math.floor(100000 + Math.random() * 900000)
}

const insertUser = async (
  idusuario,
  nombre,
  apellido,
  carrera,
  correo,
  tipo,
  activo
) => {
  // el nombre tiene que tener al menos 8 caracteres
  // de no serlo rellenar con 1's hasta completar los 8 caracteres
  const password = nombre.padEnd(7, '1').concat('!')
  const user = {
    idusuario,
    nombre,
    apellido,
    carrera,
    correo,
    password,
    tipo,
    activo
  }
  try {
    const response = await axios.post(
      'http://localhost:3000/usuario/create',
      user
    )
    if (response.status === 201) {
      console.log('Usuario insertado', idusuario)
    } else {
      console.log('Error en la insercion', response.data.message)
    }
  } catch (error) {
    console.error(
      'Error en la insercion',
      error.response ? error.response.data : error.message
    )
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
}

main()
