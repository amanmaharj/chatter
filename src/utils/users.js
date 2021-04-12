//keep tracking of the users in the array

const users = []

//addUsers, removeusers, getUsers, getUsersInRoom

const addUsers = ({id, username, room}) => {
    //clean the data using the trim method to trim extra spaces and make it to lowercase
    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()

    //validate the data if either of the room or username is not provided following code run with the error message .
    if (!username || !room) {
        return {
            error: 'username and room are required!'
        }
    }
    //check for existing, users are checked whether they are already in the chat room or not
    const existingUsers = users.find((user)=>{
    //here user is the data of the Users array in which user exactly is the object which have id, username, room as their property
        return user.room === room && user.username === username
    })

    //validate username
    if(existingUsers){
        return {
            error: 'username is in use!'
        }
    }

    //store user which itself is the object containing the property id, username and room
    const user = {id, username, room}
    //storing the user in the array users
    users.push(user)
    return {user}
}
//removing the users form the array .
//we provid with the id
const removeUsers = (id) =>{
    //findIndex method is used to find the user from the array
    const index = users.findIndex((user)=>{
       return user.id === id
    })
    //condition check when we find the user the index will always be 0 or above, if it didn't find it will return -1.
    if (index != -1){
    //here splice method is used to delete the user from the users array 
        return users.splice(index, 1)[0]
    }
}

//function to get the user by their id
const getUser = (id) =>{
    return users.find((user)=>user.id === id)
}

//function to get the users in that specific room this will return the array of users in that room using the filter method
const getUsersInRoom = (room) =>{
   return users.filter((user) => user.room === room)
}

module.exports={
    addUsers,
    removeUsers,
    getUser,
    getUsersInRoom
}