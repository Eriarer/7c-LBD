import 'dotenv/config'
import axios from 'axios'
import { pool } from '../db/db.js' //Importando la piscina de conexiones

const PREFIX = [
  'Lu',
  'Mar',
  'Ale',
  'Is',
  'Jo',
  'And',
  'Ro',
  'Ju',
  'San',
  'Vic',
  'An',
  'Mi',
  'Die',
  'Lo',
  'Gab',
  'Se',
  'Ra',
  'Da',
  'Al',
  'Pa'
]

const SUFFIX = [
  'iel',
  'ian',
  'us',
  'son',
  'iel',
  'aro',
  'ia',
  'ina',
  'on',
  'ar',
  'ito',
  'ius',
  'ias',
  'ric',
  'ent',
  'lis',
  'eus',
  'rin',
  'mar',
  'der'
]

const APELLIDO = [
  'Gomez',
  'Perez',
  'Rodriguez',
  'Gonzalez',
  'Fernandez',
  'Lopez',
  'Diaz',
  'Martinez',
  'Sanchez',
  'Ramirez',
  'Gutierrez',
  'Torres',
  'Rivera',
  'Vasquez',
  'Castillo',
  'Jimenez',
  'Moreno',
  'Hernandez',
  'Luna',
  'Silva',
  'Cruz',
  'Ortiz',
  'Vargas',
  'Ruiz'
]
const CARRERA = [
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
const TIPO = ['ALUMNO', 'MAESTRO', 'EXTERNO', 'RESPONSABLE', 'AYUDANTE']

const getRandomElement = (array) => {
  return array[Math.floor(Math.random() * array.length)]
}

const generateName = () => {
  const name = `${getRandomElement(PREFIX)}${getRandomElement(SUFFIX)}`
  console.log(name)
  return name
}

const generateLastName = () => {
  return `${getRandomElement(APELLIDO)} ${getRandomElement(APELLIDO)}`
}

const generatePassword = (nombre) => {
  return nombre.padEnd(7, '1').concat('!')
}

const generateEmail = (nombre, apellido) => {
  return `${nombre.toLowerCase()}.${apellido
    .toLowerCase()
    .replace(' ', '')}@localhost.com`
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
  password,
  activo
) => {
  const user = {
    idusuario,
    nombre,
    apellido,
    correo,
    password,
    tipo,
    activo
  }
  if (carrera) user.carrera = carrera
  try {
    const response = await axios.post(
      'http://localhost:3000/usuario/create',
      user
    )
    if (response.status === 201) {
      console.log('✅Usuario insertado', idusuario)
    } else {
      throw new Error('❌Error en la insercion', response.data.message)
    }
  } catch (error) {
    console.error(
      '⚠️ Error en la insercion',
      error.response ? error.response.data : error.message
    )
  }
}

const main = async () => {
  const result = await pool.query(
    'SELECT MAX(CAST(idusuario AS unsigned)) as id FROM usuario'
  )
  const last_id = result[0][0].id == null ? 0 : parseInt(result[0][0].id) + 1
  const paro = last_id + 5
  console.log('Iniciando inserción de usuarios')

  for (let i = last_id; i < paro; i++) {
    const nombre = generateName()
    const apellido = generateLastName()
    const carrera = Math.random() > 0.25 ? getRandomElement(CARRERA) : null
    const correo = generateEmail(nombre, apellido)
    const password = generatePassword(nombre)
    const tipo = getRandomElement(TIPO)
    const activo = Math.random() > 0.25 ? true : false
    await insertUser(
      i,
      nombre,
      apellido,
      carrera,
      correo,
      tipo,
      password,
      activo
    )
  }
}

await main().then(() => {
  console.log('Proceso terminado')
  process.exit(0)
})
