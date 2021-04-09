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

//This is the event listener used specifically for the finding the geolocation of the user
document.querySelector('#send-location').addEventListener('click',()=>{
//Some of the browser don't support the navigator feature so to address that we need to make sure we deal with that with if else statement
    if(!navigator.geolocation){
        return alert('Geolocation is not supported by your browser')
    }
//the navigator is used to fetch the current location data of the user.
    navigator.geolocation.getCurrentPosition((position)=>{
        
//sending the latitude and longitude information by passing through the object
        socket.emit('sendLocation',  {
            lati: position.coords.latitude,
            longi: position.coords.longitude
        })
    })

})

