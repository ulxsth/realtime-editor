import express from 'express'

const app = express()
const port = 3000

app.use(express.static('public'))

app.get("/", (req, res) => {
  return express.static('public/index.html')
})

app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
}).on('error', (err) => {
  throw new Error(err.message)
})
