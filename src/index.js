'use strict'

const app = require('./app')
const port = process.env.PORT || 3000

app.listen(port, _ => {
  console.log(`App is start on port: ${port}`)
})
