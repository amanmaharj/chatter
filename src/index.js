const http = require('http')
const express = require('express')
const path = require('path')
const socketio = require('socket.io')
const Filter = require('bad-words')

const app = express()
//The variable server is just used for creating raw http server. which is really important for passing to the socketio function
const server = http.createServer(app)
//io is new instance of socket.io where we call socketio as the function and pass the server
//now the new server supports websocket
const io = socketio(server)


const port = process.env.PORT || 4000

//It helps to join the public folder which contain public files to join with this current src folder
const publicDirectoryPath = path.join(__dirname, '../public')//'../ helps to go in the root folder'

//A middleware to make sure the path for the public folder is working 
app.use(express.static(publicDirectoryPath))

//used to check the connection established between the user and server but had to add /socket.io/socket.io.js(created automatically for us) and /js/chat.js in index.html file
// let count = 0;
let greet = 'Welcome!!'

//io.on is used for the users who have connected in that server
io.on('connection', ( socket )=>{
    console.log('new connection')
//send event server custom one
//message is the event name and greet is the data to be send
    socket.emit('message', greet)

//send it to everybody except the one who joined the connection(particular connection)
    socket.broadcast.emit('message','New user has joined')

//callback is used for the acknowledgement, we can use this callback to send message to the client
    socket.on('sendMessage', (message, callback)=>{

//used to filter the words containing foul language
        const filter = new Filter()
        //checking the message data that contain the foul language
        if (filter.isProfane(message)){
            return callback('Profanity is not allowed')
        }

        io.emit('message', message)
//passing the message to the client as an acknowledgement
        callback()
       
    })
//callback parameter has been acknowledgement
    socket.on('sendLocation', (pos, callback)=>{
        //receiving the information from the sendlocation event and displaying it
        io.emit('message', `https://google.com/maps?q=${pos.lati},${pos.longi}`)
        callback()
    })

//built in event 'disconnect' and send the message to the all the user in that connection
    socket.on('disconnect', () => {
        io.emit('message', 'user has left')
    })
})


server.listen(port, ()=>{
    console.log(`server is up on port ${port}`)
})