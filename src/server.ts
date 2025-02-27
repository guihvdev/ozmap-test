import { createApp } from './main'
import { geocoder } from './modules/geocoder/geocoder'

createApp({ geocoder })
  .then(({ app, loggerService }) => {
    app.listen(process.env.API_PORT, () => {
      loggerService.log(`Server running on port ${process.env.API_PORT}`, 'Bootstrap')
    })
  })
  .catch((err) => {
    console.error(err)
  })
