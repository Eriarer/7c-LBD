import mysql from 'mysql'

export async function connectDB(config) {
  const connection = mysql.createConnection({
    host: config.host,
    user: config.user,
    password: config.password,
    database: config.database,
    port: config.port,
    dateStrings: true,
    timezone: 'utc-6',
    multipleStatements: true
  })
  await connection.connect((err) => {
    if (err) {
      console.error('Error connecting to database: ', err)
      return
    }
    console.log('Connected to database')
  })
  connection.on('error', (err) => {
    console.error('Database error: ', err)
  })
}