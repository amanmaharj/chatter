//cliet side function return value
const socket = io()
//message is the event name and second parameter is the callback function
socket.on('message',(msg)=>{
    console.log(msg)
})

document.querySelector('#message-form').addEventListener('submit', (e)=>{
    //prevent full page refresh
    e.preventDefault()
    //get the value form the input field from the form e is the event from there target and from there name attribute which is a fullproof.
    const message = e.target.elements.message.value
    
    socket.emit('sendMessage', message)
    
})