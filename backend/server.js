import 'dotenv/config'
import app from './app.js'
import { appConfig } from './config.js'

async function init(appConfig) {
  try {
    app.listen(appConfig.port, () => {
      console.log(`App is running on http://localhost:${appConfig.port}`)
    })
  } catch (err) {
    console.error(err)
    process.exit(1)
  }
}

init(appConfig)
