const express = require('express')
const path = require('path')


const app = express()

const port = process.env.PORT || 3000
//It helps to join the public folder which contain public files to join with this current src folder
const publicDirectoryPath = path.join(__dirname, '../public')//'../ helps to go in the root folder'

//A middleware to make sure the path for the public folder is working 
app.use(express.static(publicDirectoryPath))

app.listen(port, ()=>{
    console.log(`server is up on port ${port}`)
})