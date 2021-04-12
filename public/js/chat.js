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

//Options Qs is accessible from the script src js file loaded in the chat.html page, location.search is the global method used to fetch the query string provided from the index.html form
//Qs.parse help us to parse the query string from the url, The prefix can be ignore i.e. '?' sign with the help of the ignorequeryprefix method.
const { username, room } = Qs.parse(location.search, {ignoreQueryPrefix: true})


//elements of the button of the location
const $sendLocationButton = document.querySelector('#send-location')

//message is the event name and second parameter is the callback function which has the value in the format of object which contain text and timestamp
socket.on('message',(message)=>{
    console.log(message)
    //messageTemplate is render with the object key value , value is transfered from the msg.
    const html = Mustache.render(messageTemplate,{
        username: message.username,
        message : message.text,
        //moment is used to make the timestamp more human readable
        createdAt: moment(message.createdAt).format('hh:mm A')
    })
    //insertAdjacentHTML method is used to add extra html element
    $messages.insertAdjacentHTML('beforeend', html)
})

//location message event listener
socket.on('locationMessage',(message)=>{
    console.log(message)

    const html = Mustache.render(locationMessageTemplate,{
        username: message.username,
        url : message.url,
        createdAt: moment(message.createdAt).format('hh:mm A')
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

socket.emit('join',{ username, room },(error)=>{
    if(error){
        alert(error)
        location.href = '/'
    }
})