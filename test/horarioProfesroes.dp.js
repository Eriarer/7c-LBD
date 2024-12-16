import axios from 'axios'

const BASEURL = 'http://localhost:3000'

const obtenerUsuarios = async () => {
  const usuarios = await (await axios.get(`${BASEURL}/usuario/get`)).data.data

  return usuarios.filter((usuario) => usuario.tipo === 'MAESTRO')
}

const obtenerHorarioServicio = async () => {
  return await (
    await axios.get(`${BASEURL}/horarioServicio/get`)
  ).data.data
}

// generar un string aleatorio que cumpla con la siguiente regex
// ^(LU|MA|MI|JU|VI)(,(LU|MA|MI|JU|VI))*$
const obtenerRandomDias = () => {
  const dias = ['LU', 'MA', 'MI', 'JU', 'VI']
  let randomDias = ''
  for (let i = 0; i < 5; i++) {
    if (Math.random() < 0.5) {
      randomDias += dias[i] + ','
    }
  }
  return randomDias.slice(0, -1)
}

const altaHorarioProfesor = async (horarioProfesor) => {
  try {
    const res = await axios.post(
      `${BASEURL}/horarioProfesores/create`,
      horarioProfesor
    )
    if (res.data.status === 'success') {
      console.log('Horario profesor creado')
    } else {
      console.log('Error al crear horario profesor')
    }
  } catch (error) {
    console.error('Error desconocido al crear horario profesor')
  }
}

const main = async () => {
  const laboratorios = await await (
    await axios.get(`${BASEURL}/laboratorio/get`)
  ).data.data
  const maestros = await obtenerUsuarios()
  const horariosServicio = await obtenerHorarioServicio()
  //obtener usuarios aleatorios
  // por cada laboratorio crear un horario de servicio
  for (const laboratorio of laboratorios) {
    //  filtrar el arreglo horarioServicio por idlaboratorio
    const horarioServicioLaboratorio = horariosServicio.filter(
      (horario) => horario.idlaboratorio === laboratorio.idlaboratorio
    )
    const horaInicioLaboratorio = horarioServicioLaboratorio[0].hora_inicio
    const horaFinLaboratorio = horarioServicioLaboratorio[0].hora_cierre
    // tomar una hora  aleatoria entre hora_inicio y hora_cierre formato hoarioServiico
    // las horaInicio y horaFin tienen formato HH:MM:SS en 24 horas
    const diferenciaHoras =
      parseInt(horaFinLaboratorio.split(':')[0]) -
      parseInt(horaInicioLaboratorio.split(':')[0])
    const hora = Math.floor(
      Math.random() * diferenciaHoras +
        parseInt(horaInicioLaboratorio.split(':')[0])
    )
    const horaFin = hora + 1
    // formatear la hora a HH:MM:SS
    const hora_inicio = `${(hora + '').padStart(2, '0')}:00:00`
    const hora_cierre = `${(hora + '').padStart(2, '0')}:00:00`
    // Obtener maestros aleatorios y agregar el hoarioprofesor
    for (const maestro of maestros) {
      if (Math.random() < 0.85) continue
      const horarioProfesor = {
        idlaboratorio: laboratorio.idlaboratorio,
        idusuario: maestro.idusuario,
        hora_inicio,
        hora_cierre,
        dias: obtenerRandomDias()
      }
      await altaHorarioProfesor(horarioProfesor)
    }
  }
}

main()
