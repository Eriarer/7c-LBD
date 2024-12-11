import swaggerJSDoc from 'swagger-jsdoc'

const options = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Manejo de Laboratorios API',
      version: '0.1.0',
      description:
        'REST API para el manejo de laboratorios de la Universidad Autónoma de Aguascalientes'
    }
  },
  servers: [
    {
      url: 'http://localhost:3000',
      description: 'Development server'
    }
  ],
  schemes: ['http'],
  apis: ['./swagger/*.yaml']
}

const swaggerSpec = swaggerJSDoc(options)

export default swaggerSpec
