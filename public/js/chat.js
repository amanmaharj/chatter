//cliet side function return value
const socket = io()

//elements of the forms
const $messageForm = document.querySelector('#message-form')
const $messageFormInput = $messageForm.querySelector('input')
const $messageFormButton = $messageForm.querySelector('button')

//elements of the page to render the message
const $messages = document.querySelector('#messages')



//tempalates //innerHtml is used to render something in the browser
const messageTemplate = document.querySelector('#message-template').innerHTML
const locationMessageTemplate = document.querySelector('#location-message-template').innerHTML

//elements of the button of the location
const $sendLocationButton = document.querySelector('#send-location')

//message is the event name and second parameter is the callback function
socket.on('message',(msg)=>{
    console.log(msg)
    //messageTemplate is render with the object key value , value is transfered from the msg.
    const html = Mustache.render(messageTemplate,{
        message : msg
    })
    //insertAdjacentHTML method is used to add extra html element
    $messages.insertAdjacentHTML('beforeend', html)
})

//location message event listener
socket.on('locationMessage',(url)=>{
    console.log(url)

    const html = Mustache.render(locationMessageTemplate,{
        url
    })
    $messages.insertAdjacentHTML('beforeend',html)
})

$messageForm.addEventListener('submit', (e)=>{
    //prevent full page refresh
    e.preventDefault()
    //get the value form the input field from the form e is the event from there target and from there name attribute which is a fullproof method to get the value.
    //disabled the form button
    $messageFormButton.setAttribute('disabled','disabled')
    const message = e.target.elements.message.value

    //final argument as an callback function for the event acknowledgement
    socket.emit('sendMessage', message, (error) => {

        //removing the attribute name disabled of the form button
        $messageFormButton.removeAttribute('disabled')
        //clearing the input value
        $messageFormInput.value = ''
        //getting the focus in the input
        $messageFormInput.focus()

        if(error){
            return console.log(error)
        }

        console.log('message is delivered!')
    })
    
})

//This is the event listener used specifically for the finding the geolocation of the user
$sendLocationButton.addEventListener('click',()=>{
//Some of the browser don't support the navigator feature so to address that we need to make sure we deal with that with if else statement
    if(!navigator.geolocation){
        return alert('Geolocation is not supported by your browser')
    }

    $sendLocationButton.setAttribute('disabled','disabled')
//the navigator is used to fetch the current location data of the user.
    navigator.geolocation.getCurrentPosition((position)=>{
        
//sending the latitude and longitude information by passing through the object
        socket.emit('sendLocation',  {
            lati: position.coords.latitude,
            longi: position.coords.longitude
        },()=>{
            $sendLocationButton.removeAttribute('disabled')
            console.log('location shared!')
        })
    })

})

