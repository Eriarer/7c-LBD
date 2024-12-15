import axios from 'axios'

const laboratorios = [
  {
    plantel: 'Campus Central',
    num_ed: 54,
    aula: 'H',
    departamento: 'Redes',
    cupo: 30,
    latitude: 21.913545970238864,
    longitude: -102.31628707072989
  },
  {
    plantel: 'Campus Central',
    num_ed: 54,
    aula: 'I',
    departamento: 'Cómputo',
    cupo: 30,
    latitude: 21.913545970238864,
    longitude: -102.31628707072989
  },
  {
    plantel: 'Campus Central',
    num_ed: 57,
    aula: 'A',
    departamento: 'Electrónica Digital',
    cupo: 30,
    latitude: 21.913192982752733,
    longitude: -102.31646673605793
  },
  {
    plantel: 'Campus Central',
    num_ed: 57,
    aula: 'B',
    departamento: 'Electrónica Analógica',
    cupo: 30,
    latitude: 21.913192982752733,
    longitude: -102.31646673605793
  },
  {
    plantel: 'Campus Central',
    num_ed: 57,
    aula: 'C',
    departamento: 'Cómputo Electrónico',
    cupo: 30,
    latitude: 21.913192982752733,
    longitude: -102.31646673605793
  },
  {
    plantel: 'Campus Central',
    num_ed: 117,
    departamento: 'Electrónica de Control y Comunicaciones',
    cupo: 30,
    latitude: 21.91660977758772,
    longitude: -102.31950842022161,
    descripcion: 'Hubicado en la planta alta del edificio 117'
  },
  {
    plantel: 'Campus Central',
    num_ed: 204,
    departamento: 'Cómputo de Sistemas Distribuidos',
    cupo: 30,
    latitude: 21.910302914739823,
    longitude: -102.31603315947581,
    descripcion:
      'Ubicado en la planta baja, en las secciones B, C y D del edificio 204'
  }
]

const addLaboratorios = async () => {
  for (const laboratorio of laboratorios) {
    try {
      const response = await axios.post(
        'http://localhost:3000/laboratorio/create',
        laboratorio
      )
      console.log(
        `✅ Éxito: Laboratorio de ${laboratorio.departamento} agregado con éxito.`
      )
    } catch (error) {
      console.error(
        `⚠️ Error al agregar el laboratorio de ${laboratorio.departamento}:`,
        error.response?.data || error.message
      )
    }
  }
}

addLaboratorios()
