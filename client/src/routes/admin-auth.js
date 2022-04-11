import axios from 'axios'
import {ADMIN_AUTH} from "../config";

//Api call to the backend to autheticate the user using the website
const Authenticator=(callback)=>{
    if (!localStorage.getItem('token')) {
        return callback(false);
    }
    const url = ADMIN_AUTH;
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization':`Bearer ${localStorage.getItem('token')}`
        }
    }
    axios.get(url,config)
        .then((result) => {
            callback(true)
    
        }).catch((error) => {
            callback(false)
        })
}

export default Authenticator