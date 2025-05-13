import React from 'react';
import "./App.css";
import "./SignIn.css";
import UserProfile from './UserProfile';
import Main from './Main';
import { render } from 'react-dom';
import {useState} from 'react';
import Axios from 'axios'
import {BrowserRouter as Router, Switch as Routes,Route, Link, useParams, useRouteMatch, Redirect} from 'react-router-dom';
function SignIn(){

    let {path, url} = useRouteMatch();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

   
    const [isLoggedIn, setIsLoggedIn]  = useState(false);
    const test = () =>{
        console.log("success");
    }

    //salt and hash
    function retrieveUser() {
        Axios.post('http://localhost:3001/SignIn', {
            username: username,
            password: password
        }).then((response)=>{
            console.log(response.data);
            if(response.data == "User name does not exist" || response.data == "Incorrect Password"){  //if comparison does not work, try 3 equal operators
               // console.log(response.data);
            }else{
                return(
                    <div>
                        {setIsLoggedIn(true)} 
                    </div>
                     
                );
                 
                console.log(isLoggedIn);
            }
        });
    }
    
    if(isLoggedIn == false){
        return(
            <div className = "CenterContent">
            <body className = "Menu">
                <div>
                <h1>
                    Sign In
                </h1>
                <div className = "TextBoxes">                    
                    
                    <input  name = "uname" placeholder = "Enter username" type = "text" onChange={(event) => {setUsername(event.target.value);}}/>
                    <input name = "psw" placeholder = "Enter password" type = "password" onChange={(event) => {setPassword(event.target.value);}}/>   
                </div>   

                <div className = "SubmitOptions">
                    <button className = "SubmitButton" onClick = {retrieveUser}>
                        <b>Login</b>
                    </button >
                    <Link to = "/createaccount">Don't have an account? Sign up here</Link>
                </div>
                </div>
                
            </body>
            </div>



         
        );
    }else{

        return(
            <div>
                
                <Router>
                    <Redirect to={`${url}/${username}`}/>
                <Routes>
                    <Route path= {`${path}/:userID`} >
                        <UserProfile  username = {username}/>  
                    </Route>
                </Routes>
                </Router>
            </div>    
        );
    }

    

    
    

}
export default SignIn;