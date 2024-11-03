import 'dotenv/config'
import app from './app.js'
import { connectDB } from './db/db.js'
import { appConfig, dbConfig } from './config.js'

async function init(appConfig, dbConfig) {
  try {
    await connectDB(dbConfig)
    app.listen(appConfig.port, () => {
      console.log(`Server is running on port ${appConfig.port}`)
    })
  } catch (err) {
    console.error(err)
    process.exit(1)
  }
}

init(appConfig, dbConfig)
