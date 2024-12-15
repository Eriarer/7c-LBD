import axios from 'axios'

const BASEURL = 'http://localhost:3000'

const horario = {
  hora_inicio: '08:00:00',
  hora_cierre: '20:00:00',
  dias: 'LU,MA,MI,JU,VI'
}

const main = async () => {
  const laboratorios = await await (
    await axios.get(`${BASEURL}/laboratorio/get`)
  ).data.data
  console.log(laboratorios)
  // por cada laboratorio crear un horario de servicio
  for (const laboratorio of laboratorios) {
    const response = await axios.post(`${BASEURL}/horarioServicio/create`, {
      ...horario,
      idlaboratorio: laboratorio.idlaboratorio
    })
    if (response.status === 201) {
      console.log('Horario de servicio insertado')
    } else {
      console.log('Error en la insercion', response.data.message)
    }
  }
}

main()
