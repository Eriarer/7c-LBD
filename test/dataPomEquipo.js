import 'dotenv/config'
import { pool } from '../db/db.js' //Importando la piscina de conexiones

const equipos = [
  {
    nombre: 'Laptop',
    descripcion:
      'RAM 8GB, Memoria 500GB, Procesador Intel Core i5, Sistema Operativo: Windows 10, Monitor: 19. Programas: Excel, Word, Minitab, RStudio, Visual Studio Code, NetBeans, DevC++, Anaconda, Java, R, C, C++',
    disponible: 1
  },
  {
    nombre: 'PC',
    descripcion:
      'RAM 4GB, Memoria 256GB, Procesador Intel Core i3, Sistema Operativo: Windows 8. Programas: Excel, Word, Minitab, RStudio,NetBeans, DevC++, Java, R, C, C++',
    disponible: 1
  },
  {
    nombre: 'Proyector',
    descripcion:
      'Proyector Epson, 3000 lúmenes, 800x600, 4:3, VGA, HDMI, USB, 2W, 2.4 kg',
    disponible: 1
  },
  {
    nombre: 'LM324',
    descripcion:
      'Amplificador Operacional LM324, 4 canales, 1.2 MHz, 0.5 V/us, 3-32V, 0-70°C, DIP-14',
    disponible: 1
  },
  {
    nombre: 'Arduino Uno',
    descripcion:
      'Microcontrolador ATmega328, 14 pines digitales, 6 pines analogicos, 32 KB, 16 MHz, USB, 5V',
    disponible: 1
  },
  {
    nombre: 'Osciloscopio',
    descripcion: 'Osciloscopio Digital, 2 canales, 100 MHz, 1 GS/s, 7 pulgadas',
    disponible: 1
  },
  {
    nombre: 'Protoboard',
    descripcion: 'Protoboard 830 puntos, 166 columnas, 2 buses de alimentacion',
    disponible: 1
  },
  {
    nombre: 'Multimetro',
    descripcion:
      'Multimetro Digital, 6000 cuentas, 10A, 1000V, 10 Mohm, 10 uF, 10 MHz, CAT III 1000V, CAT IV 600V',
    disponible: 1
  },
  {
    nombre: 'Fuente de Poder',
    descripcion:
      'Fuente de Poder, 0-30V, 0-5A, 150W, Proteccion contra cortocircuitos, Proteccion contra sobrecalentamiento',
    disponible: 1
  },
  {
    nombre: 'Potenciómetro',
    descripcion:
      'Componente ajustable utilizado para controlar el voltaje o corriente en un circuito.',
    disponible: 1
  },
  {
    nombre: 'Cautin',
    descripcion:
      'Cautin de 60W, 110V, Punta de 1/8 pulgada, Temperatura maxima de 480°C',
    disponible: 1
  },
  {
    nombre: 'Soldadura',
    descripcion: 'Soldadura de 60/40, 1mm, 100g',
    disponible: 1
  },
  {
    nombre: 'Pinzas',
    descripcion: 'Pinzas de punta fina, 12cm, Acero inoxidable',
    disponible: 1
  },
  {
    nombre: 'LEDs',
    descripcion: 'LEDs 5mm, 5 colores',
    disponible: 1
  },
  {
    nombre: 'Resistencias',
    descripcion: 'Resistencias 1/4W, 5%, 100 ohm',
    disponible: 1
  },
  {
    nombre: 'Resistencias',
    descripcion: 'Resistencias 1/4W, 5%, 220 ohm',
    disponible: 1
  },
  {
    nombre: 'Resistencias',
    descripcion: 'Resistencias 1/4W, 5%, 1 kohm',
    disponible: 1
  },
  {
    nombre: 'Resistencias',
    descripcion: 'Resistencias 1/4W, 5%, 10 kohm',
    disponible: 1
  },
  {
    nombre: 'Capacitores',
    descripcion: 'Capacitores 1uF, 50V',
    disponible: 1
  },
  {
    nombre: 'Capacitores',
    descripcion: 'Capacitores 10uF, 50V',
    disponible: 1
  },
  {
    nombre: 'Capacitores',
    descripcion: 'Capacitores 100uF, 50V',
    disponible: 1
  }
]

//////////////////// INSERCIONES A LAS TABLAS ////////////////////

const insertEquipo = async (nombre, descripcion, disponible) => {
  const sql =
    'INSERT INTO equipo (nombre, descripcion, disponible) VALUES (?, ?, ?)'
  try {
    const result = await pool.query(sql, [nombre, descripcion, disponible])
    if (result[0].affectedRows === 1) {
      console.log('Equipo insertado', nombre)
    } else {
      console.log('Error en la insercion', result[0].message)
    }
  } catch (error) {
    console.error('Error en la insercion', error)
  }
}

const insertInventario = async (idlaboratorio, idunidad, cantidad) => {
  const sql =
    'INSERT INTO inventario (idlaboratorio, idunidad, cantidad) VALUES (?, ?, ?)'
  try {
    const [result] = await pool.query(sql, [idlaboratorio, idunidad, cantidad])
    if (result.affectedRows === 1) {
      console.log(
        `Relación insertada para laboratorio ${idlaboratorio} con equipo ${idunidad}`
      )
    } else {
      console.log('Error en la inserción de relación')
    }
  } catch (error) {
    console.error('Error en la inserción de relación', error)
  }
}

//////////////////// TRUNCATE DE LAS TABLAS ////////////////////

//Función para borrado de la tabla equipo
async function truncateEquipo() {
  try {
    //Checa si hay datos en la tabla equipo
    const resultSelect = await pool.query('SELECT * FROM equipo')
    if (resultSelect[0].length === 0) {
      console.log('No hay datos en la tabla equipo')
      return
    }
    await pool.query('SET FOREIGN_KEY_CHECKS = 0;') // Deshabilitar claves foráneas temporalmente
    const result = await pool.query('TRUNCATE TABLE equipo')
    await pool.query('SET FOREIGN_KEY_CHECKS = 1;') // Habilitar claves foráneas

    console.log('Tabla equipo truncada')
  } catch (error) {
    console.error('Error en el truncado', error)
  }
}

//Función para borrar la tabla inventario
async function truncateInventario() {
  try {
    //Checa si hay datos en la tabla inventario
    const resultSelect = await pool.query('SELECT * FROM inventario')
    if (resultSelect[0].length === 0) {
      console.log('No hay datos en la tabla inventario')
      return
    }
    await pool.query('SET FOREIGN_KEY_CHECKS = 0;') // Deshabilitar claves foráneas temporalmente
    const result = await pool.query('TRUNCATE TABLE inventario')
    await pool.query('SET FOREIGN_KEY_CHECKS = 1;') // Habilitar claves foráneas

    console.log('Tabla inventario truncada')
  } catch (error) {
    console.error('Error en el truncado', error)
  }
}

//////////////////// OTRAS FUNCIONES ////////////////////

const obtenerLaboratorios = async () => {
  const sql = 'SELECT * FROM laboratorio' // Suponiendo que la tabla se llama 'laboratorios'
  try {
    const [result] = await pool.query(sql)
    return result // Retorna todos los laboratorios
  } catch (error) {
    console.error('Error al obtener laboratorios:', error)
  }
}

const obtenerEquipos = async () => {
  const query = 'SELECT idequipo, nombre FROM equipo' // Consulta de equipos
  const [result] = await pool.execute(query)
  return result
}

const obtenerCantidadAleatoria = () => {
  return Math.floor(Math.random() * (25 - 5 + 1)) + 5 // Genera un número entre 5 y 25
}

const asignarEquiposALaboratorios = async () => {
  const laboratorios = await obtenerLaboratorios()
  const equipos = await obtenerEquipos() // Obtener equipos desde la BD

  for (const laboratorio of laboratorios) {
    const { idlaboratorio, departamento } = laboratorio

    if (departamento === 'Ciencias Exactas') {
      // Asignar los primeros 3 equipos de la lista a Ciencias Exactas
      for (let i = 0; i < 3; i++) {
        const equipo = equipos[i] // Seleccionar equipo por índice
        if (equipo) {
          const cantidad = obtenerCantidadAleatoria()
          await insertInventario(idlaboratorio, equipo.idequipo, cantidad)
        }
      }
    }

    if (departamento === 'Electronica') {
      // Asignar equipos aleatorios a Electrónica
      for (let i = 0; i < 3; i++) {
        const equipo = equipos[Math.floor(Math.random() * equipos.length)] // Selección aleatoria
        if (equipo) {
          const cantidad = obtenerCantidadAleatoria()
          await insertInventario(idlaboratorio, equipo.idequipo, cantidad)
        }
      }
    }
  }
}

//////////////////// MAIN ////////////////////
const main = async () => {
  await truncateEquipo() //Borrando la tabla equipo
  await truncateInventario() //Borrando la tabla inventario

  for (const lab of equipos) {
    await insertEquipo(lab.nombre, lab.descripcion, lab.disponible)
  }

  await asignarEquiposALaboratorios() // Ejecuta la asignación

  await pool.query('SELECT * FROM equipo').then((result) => {
    console.log(result[0])
  })

  await pool.end()
}

main()
