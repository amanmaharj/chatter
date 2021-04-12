//this function is used to get the message and the timestamp of the message
const generateMessage = ( username, text )=>{
    return {
        username,
        text,
        createdAt: new Date().getTime()
    }
}

const generateLocation = (username,url) =>{
    return {
        username,
        url,
        createdAt: new Date().getTime()
    }
}
module.exports = {
    generateMessage,
    generateLocation
}