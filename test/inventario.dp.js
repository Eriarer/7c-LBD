import axios from 'axios'

const URL = 'http://localhost:3000'

const createInventario = async (idlaboratorio, idunidad, cantidad) => {
  try {
    const response = await axios.post(`${URL}/inventario/create`, {
      idlaboratorio,
      idunidad,
      cantidad
    })
    console.log(`Inventario creado: ${response.data.message}`)
  } catch (error) {
    console.error(`Error creando inventario: ${error}`)
  }
}

const main = async () => {
  try {
    const [laboratorios] = await Promise.all([
      axios.get(`${URL}/laboratorio/get`)
    ])
    const [equipo] = await Promise.all([axios.get(`${URL}/equipo/get`)])

    for (const laboratorio of laboratorios.data.data) {
      for (const inventario of equipo.data.data) {
        if (Math.random() < 0.8) continue
        console.log(
          `Creando inventario para laboratorio ${laboratorio.idlaboratorio} y equipo ${inventario.idequipo}`
        )
        await createInventario(
          laboratorio.idlaboratorio,
          inventario.idequipo,
          Math.floor(Math.random() * 31) + 10
        )
      }
    }
  } catch (error) {
    console.error('Error in main function:', error)
  }
}

main()
