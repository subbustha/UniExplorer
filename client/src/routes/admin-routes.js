import axios from 'axios'

//Creating new Admin
const CreateAdmin=(adminData,callback)=>{
    const url='https://francos-backend.herokuapp.com/api/admin/signup'
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization':`Bearer ${localStorage.getItem('token')}`
        }
    }
    axios.post(url,adminData,config)
    .then((result)=>{
        callback(201,result)
    }).catch((error)=>{
        console.log(error.response)
        callback(error.response.status,error.response.data)
    })
}

//Resetting Admin Password
const ResetPassword=(adminEmail,callback)=>{
    axios.patch('https://francos-backend.herokuapp.com/api/admin/reset',adminEmail)
    .then((result)=>{
        console.log(result)
        callback(200,result)
    }).catch((error)=>{
        console.log(error)
        callback(error.response.status,'error')
    })
}

//Sending the new password with Auth Code
const SendPassword=(adminData,callback)=>{
    axios.patch('https://francos-backend.herokuapp.com/api/admin/reset/password',adminData)
    .then((result)=>{
        console.log(result)
        callback(200,result)
    }).catch((error)=>{
        console.log(error)
        callback(error.response.status,'error')
    })
}

//Fetching all admins informations
const GetAdmins=(callback)=>{
    if (!localStorage.getItem('token')) {
        return callback(404,"error")
    }
    const url = 'https://francos-backend.herokuapp.com/api/admin/all'
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization':`Bearer ${localStorage.getItem('token')}`
        }
    }
    axios.get(url,config)
        .then((result) => {
            callback(200,result.data)
    
        }).catch((error) => {
            callback(500,"error")
        })
}

//Deleting an admin
const DeleteAdmin=(adminEmail,callback)=>{
    console.log('Log for DeleteAdmin')
    if (!localStorage.getItem('token')) {
        return callback(404,"error")
    }
    const url = 'https://francos-backend.herokuapp.com/api/admin'
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization':`Bearer ${localStorage.getItem('token')}`,
            'Email':adminEmail
        }
    }
    axios.delete(url,config,{})
        .then((result) => {
            callback()
        }).catch((error) => {
            callback()
        })
}

export {CreateAdmin,ResetPassword,SendPassword,GetAdmins,DeleteAdmin}