const http = require('http')
const express = require('express')
const path = require('path')
const socketio = require('socket.io')

const app = express()
//The variable server is just used for creating raw http server. which is really importing for passing to the socketio function
const server = http.createServer(app)
//io is new instance of socket.io where we call socketio as the function and pass the server
//now the server supports websocket
const io = socketio(server)


const port = process.env.PORT || 3000
//It helps to join the public folder which contain public files to join with this current src folder
const publicDirectoryPath = path.join(__dirname, '../public')//'../ helps to go in the root folder'

//A middleware to make sure the path for the public folder is working 
app.use(express.static(publicDirectoryPath))

//used to check the connection established between the user and server but had to add /socket.io/socket.io.js(created automatically for us) and /js/chat.js in index.html file
io.on('connection', ()=>{
    console.log('new connection')
})


server.listen(port, ()=>{
    console.log(`server is up on port ${port}`)
})