const http = require('http')
const express = require('express')
const path = require('path')
const socketio = require('socket.io')
const Filter = require('bad-words')
const { generateMessage, generateLocation } = require('./utils/messages')
const {addUsers,removeUsers, getUser, getUsersInRoom} = require('./utils/users')



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


//io.on is used for the users who have connected in that server
io.on('connection', ( socket )=>{
    console.log('new connection')

//listener for the room and username from the client side destructuring help us to access the uerroom and room individually, callback functionality to acknowledge the error
    socket.on('join', ({username, room},callback)=>{

//addUsers is the custom function me make to add the user in a room in that function we have the two property in an object and we use destructuring to get those property
        const{error, user} = addUsers({id: socket.id, username, room})
//the error message is already integrated in the addUsers function
        if(error){
            return callback(error)
        }
        //socket.join method is the only method provided by the socket.io that can only be used in the serverside and is associated with .to() function.
        socket.join(user.room)

        //send event server custom one
        //we had to send the date data as well as the message so we will send it as the object key-value since there are lots of place we had to do like this we will create
        //a function in the utils/messages.js file and call the generateMesage function from there.
        socket.emit('message', generateMessage('Chatter Team','welcome'))

    //send it to everybody in the specific room except the one who joined the connection(particular connection)
    //to(room) function help to emit the message to that specific room
    //chatter is the static data value
        socket.broadcast.to(user.room).emit('message', generateMessage('Chatter Team',`${user.username} has joined!`))

        callback()
    })

//callback is used for the acknowledgement, we can use this callback to send message to the client
    socket.on('sendMessage', (message, callback)=>{

        const user = getUser(socket.id)
//used to filter the words containing foul language
        const filter = new Filter()
        //checking the message data that contain the foul language
        if (filter.isProfane(message)){
            return callback('Profanity is not allowed')
        }
        //emit the message to the room of that specific room
        io.to(user.room).emit('message', generateMessage(user.username,message))
//passing the message to the client as an acknowledgement
        callback()
       
    })
//callback parameter has been acknowledgement
    socket.on('sendLocation', (pos, callback)=>{
        const user = getUser(socket.id)
        //receiving the information from the sendlocation event and displaying it
        io.to(user.room).emit('locationMessage', generateLocation(user.username,`https://google.com/maps?q=${pos.lati},${pos.longi}`))
        callback()
    })

//built in event 'disconnect' and send the message to the all the user in that connection
    socket.on('disconnect', () => {
//here we are using the custom removeUsers function 
        const user = removeUsers(socket.id)
//make sure that the message is provided to that specific room with the to() function attached
        if(user){
            io.to(user.room).emit('message', generateMessage('Chatter Team',`${user.username} has left!`))
        }
        
    })
})


server.listen(port, ()=>{
    console.log(`server is up on port ${port}`)
    
})