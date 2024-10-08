import express from 'express'
import { Server } from 'socket.io'
import { createServer } from 'http'

const app = express()
app.use(express.static('public'))

const server = createServer(app)
const io = new Server(server)

let text = ""

app.get("/", (req, res) => {
  return express.static('public/index.html')
})

io.on("connection", (socket) => {
  console.log("A user connected: ", socket.id)
  socket.join("channel1")

  socket.on("disconnect", () => {
    console.log("A user disconnected")
  })

  socket.on("change", (msg) => {
    socket.to(msg.channelId).emit("change", msg.delta)
  })
})

const port = 3000
server.listen(port, () => {
  console.log(`Server is running on port ${port}`)
}).on('error', (err) => {
  throw new Error(err.message)
})
