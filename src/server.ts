import { createApp } from './main'
import { geocoder } from './modules/geocoder/geocoder'

createApp({ geocoder })
  .then(({ app, loggerService }) => {
    app.listen(3000, () => {
      loggerService.log('Server running on port 3000', 'Bootstrap')
    })
  })
  .catch((err) => {
    console.error(err)
  })
