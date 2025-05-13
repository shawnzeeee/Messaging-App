import React from 'react';
import "./App.css";
import {useState} from 'react';
import Axios from 'axios'
import {BrowserRouter as Router, Switch as Routes, Route, Link} from 'react-router-dom';

function CreateAccount(){
    const[username, setUsername] = useState("");
    const[password, setPassword] = useState("");
    const[school, setSchool] = useState("");

    const displayInfo = () => {
        console.log(username + " " + password);
    };


    const newUser = () =>{

        Axios.post('http://localhost:3001/CreateAccount',{
            username: username,
            password: password
        
        }).then((response) => {
            console.log(response);
        });  
    }

return(
    <div>
        <h1>Create Account </h1>
        <label>User Name</label>
        <input type = "text" onChange={(event)=> {setUsername(event.target.value);}}/>
        <label>Password</label>
        <input type = "text" onChange={(event)=> {setPassword(event.target.value);}}/>
        <button onClick = {newUser}>
            Submit
        </button>

        <Link to = "/">Return to Home</Link>
    </div>

);

}

export default CreateAccount;