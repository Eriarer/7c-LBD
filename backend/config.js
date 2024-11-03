export const appConfig = {
  port: process.env.PORT || 3000
}
export const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || '',
  database: process.env.DB_NAME || 'test',
  port: process.env.DB_PORT || 3306
}
