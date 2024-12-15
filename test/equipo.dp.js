import axios from 'axios'

const BASEURL = 'http://localhost:3000'

const equipos = [
  {
    nombre: 'Computadora de escritorio',
    descripcion: 'Computadora de escritorio con monitor de 24 pulgadas'
  },
  {
    nombre: 'Laptop',
    descripcion: 'Laptop de 15 pulgadas con 8GB de RAM'
  },
  {
    nombre: 'Impresora',
    descripcion: 'Impresora láser a color'
  },
  {
    nombre: 'Multímetro digital',
    descripcion: 'Multímetro digital con rango de 200V'
  },
  {
    nombre: 'Fuente de poder',
    descripcion: 'Fuente de poder de 30V y 5A'
  },
  {
    nombre: 'Osciloscopio',
    descripcion: 'Osciloscopio de 100MHz'
  },
  {
    nombre: 'Protoboard',
    descripcion: 'Protoboard de 830 puntos'
  },
  {
    nombre: 'Cautín',
    descripcion: 'Cautín de 60W'
  },
  {
    nombre: 'Estación de soldadura',
    descripcion: 'Estación de soldadura de 60W'
  },
  {
    nombre: 'Arduino Uno',
    descripcion: 'Arduino Uno con microcontrolador ATmega328P'
  },
  {
    nombre: 'Raspberry Pi 3',
    descripcion: 'Raspberry Pi 3 con microcontrolador BCM2837'
  },
  {
    nombre: 'Kit de resistencias',
    descripcion: 'Kit de resistencias de 1/4W'
  },
  {
    nombre: 'Kit de capacitores',
    descripcion: 'Kit de capacitores de 1uF'
  },
  {
    nombre: 'Kit de diodos',
    descripcion: 'Kit de diodos de 1N4148'
  },
  {
    nombre: 'Kit de transistores',
    descripcion: 'Kit de transistores NPN y PNP'
  }
]

const resistencias = () => {
  // hacer un ciclo para empujar resistencias de 330 ohms a 10k ohms
  const resistencias = ['330', '470', '1k', '2.2k', '4.7k', '10k']
  for (const resistencia of resistencias) {
    equipos.push({
      nombre: `Resistencia de ${resistencia} ohms`,
      descripcion: `Resistencia de ${resistencia} ohms con tolerancia de 5%`
    })
  }
}

resistencias()

const main = async () => {
  // Insertar equipos
  for (let i = 0; i < equipos.length; i++) {
    const equipo = equipos[i]
    try {
      const response = await axios.post(`${BASEURL}/equipo/create`, equipo)
      if (response.status === 201) {
        console.log('Equipo insertado', equipo.nombre)
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
}

await main().then(() => {
  console.log('Script finalizado')
  process.exit()
})
