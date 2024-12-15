import axios from 'axios'

const URL = 'http://localhost:3000'

// Function to get users
const getUsuarios = async () => {
  try {
    const response = await axios.get(`${URL}/usuario/get`)
    return response.data.data
  } catch (error) {
    console.error('Error fetching users:', error)
  }
}

// Function to get labs
const getLaboratorios = async () => {
  try {
    const response = await axios.get(`${URL}/laboratorio/get`)
    return response.data.data
  } catch (error) {
    console.error('Error fetching labs:', error)
  }
}

// Function to create a loan
const createPrestamo = async (
  idlaboratorio,
  idusuario,
  fecha,
  horainicio,
  duracion
) => {
  try {
    console.log('Creating loan...', {
      idlaboratorio,
      idusuario,
      fecha,
      horainicio,
      duracion
    })
    const response = await axios.post(`${URL}/prestamo/create`, {
      idlaboratorio,
      idusuario,
      fecha,
      horainicio,
      duracion
    })
    console.log(`Prestamo creado: ${response.data.message}`)
  } catch (error) {
    console.error('Error creating loan:', error?.response.data.message)
  }
}

// Main function to create random loans
const main = async () => {
  try {
    const usuarios = await getUsuarios()
    const laboratorios = await getLaboratorios()

    for (let i = 0; i < 30; i++) {
      const randomUsuario =
        usuarios[Math.floor(Math.random() * usuarios.length)]
      const randomLaboratorio =
        laboratorios[Math.floor(Math.random() * laboratorios.length)]
      // la fecha puede ser desde hoy a 14 días en el futuro
      let fecha = new Date().toISOString().split('T')[0]
      fecha = new Date(
        new Date(fecha).getTime() +
          Math.floor(Math.random() * 14) * 24 * 60 * 60 * 1000
      )
        .toISOString()
        .split('T')[0]
      const horainicio = `${Math.floor(Math.random() * 24)
        .toString()
        .padStart(2, '0')}:00:00`
      const duracion = Math.floor(Math.random() * 4) + 1

      console.log(
        `Creating loan for user ${randomUsuario.idusuario} in lab ${randomLaboratorio.idlaboratorio}`
      )
      await createPrestamo(
        randomLaboratorio.idlaboratorio,
        randomUsuario.idusuario,
        fecha,
        horainicio,
        duracion
      )
    }
  } catch (error) {
    console.error('Error in main function:', error)
  }
}

main()
