import axios from 'axios'

//Create Food Item in the server
const CreateItem=(data,callback)=>{
    const url='https://francos-backend.herokuapp.com/api/item'
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization':`Bearer ${localStorage.getItem('token')}`
        }
    }
    const formData=new FormData()
    formData.append('name',data.name)
    formData.append('prices',`${data.price12}:${data.price15}`)
    formData.append('description',data.description)
    if(data.upload){
        formData.append('upload',data.upload)
    }
    axios.post(url,formData,config)
    .then((result)=>{
        callback(result.status)
    }).catch((error)=>{
        callback(error.response.status)
    })

}


//Get Food Items from the server
const GetItems=(callback)=>{
    const url='https://francos-backend.herokuapp.com/api/item'
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization':`Bearer ${localStorage.getItem('token')}`
        }
    }
    axios.get(url,config)
    .then((result)=>{
        callback(result.data)
    }).catch((error)=>{
        alert(error.message)
    })
}
//Update food items to the server
const UpdateItem=(id,body,callback)=>{
    const url=`https://francos-backend.herokuapp.com/api/item/${id}`
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization':`Bearer ${localStorage.getItem('token')}`
        }
    }
    axios.patch(url,body,config)
    .then((item)=>{
        callback(item.status)
    })
    .catch((error)=>{
        callback(error.response.status)
    })
}

//Delete food items from the server
const DeleteItem=(id,callback)=>{
    const url=`https://francos-backend.herokuapp.com/api/item/${id}`
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization':`Bearer ${localStorage.getItem('token')}`
        }
    }
    axios.delete(url,config,{})
    .then((item)=>{
        callback("success")
    })
    .catch((error)=>{
        callback("error")
    })
}

//Deleting the user token after the user logout for security
const DeleteToken=()=>{
    const url='https://francos-backend.herokuapp.com/api/admin/logout'
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization':`Bearer ${localStorage.getItem('token')}`
        }
    }
    axios.post(url,undefined,config)
    .then((result)=>{
        console.log(result.message)       
    })
    .catch((error)=>{
        alert(error.message)
        localStorage.clear()
    })
}

//Get all the active orders from the db
const GetActiveOrders=(callback)=>{
    const url='https://francos-backend.herokuapp.com/api/neworders'
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization':`Bearer ${localStorage.getItem('token')}`
        }
    }
    axios.get(url,config)
    .then((result)=>{
        callback(200,result.data)
    })
    .catch((error)=>{
        callback(500,"Error")
    })
}

//Finalize the order completion process for the customer
const FinishPendingOrder=(orderNumber,callback)=>{
    const url='https://francos-backend.herokuapp.com/api/completeOrder'
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization':`Bearer ${localStorage.getItem('token')}`
        }
    }
    axios.patch(url,{id:orderNumber},config)
    .then((result)=>{
        callback(200)
    })
    .catch((error)=>{
        callback(500)
    })

}


export {CreateItem,GetItems,UpdateItem,DeleteItem,DeleteToken,GetActiveOrders,FinishPendingOrder}