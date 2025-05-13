import React, { useEffect } from 'react';

import { render } from 'react-dom';
import {useState} from 'react';
import Axios from 'axios'
import {BrowserRouter as Router, Switch, Route, useParams, useRouteMatch, Redirect, Link, Switch as Routes} from 'react-router-dom';
import FriendList from './UserProfileComponents/FriendList';
import Chats from './UserProfileComponents/Chats';
import ChatRoom from'./ChatRoom';
import Pusher from 'pusher-js';
//import FriendList from './components/FriendList';
function UserProfile(props){
    
    let {userID} = useParams();
    let {path, url} = useRouteMatch();
    const username = props.username;
    const password = props.password;
    const [school, setSchool] = useState("");
    const [friend, setFriend] = useState("");
    
    const [enterChat, setEnterChat] = useState(false);

    const [chatList, setChatList] = useState([])

    const [chatInfo, setChatInfo] = useState("");
    const pusher = new Pusher("ee781780fcff86b28597", {
        cluster: "us3"
    })
    const handleSubmit = () =>{

    }


    useEffect(()=>{
        let isMounted = true;

        if(isMounted){
            Axios.get('http://localhost:3001/chats',{
                params:{
                    username:username
                }
            }).then((response)=>{
                
                setChatList(response.data)
                console.log(response.data);
                console.log(chatList);
            })
        }
        return (()=>isMounted = false)

    },[])

    useEffect(()=>{
        
        let isMounted = true;
        if(isMounted){
            
            const channel = pusher.subscribe(`channel-newChat-${username}`);
            channel.bind("newChat",(data)=>{
                console.log("Chat Added");
                setChatList(currentArray=>[...currentArray, data]);
            })
        }

        return (()=>isMounted = false)
    },[])
    
if(!enterChat){
    return(
        <body>
        <div>
            
            <FriendList username = {username}/>
            
           
                 
            <form onSubmit = {handleSubmit}>
                <label>
                    Enter your school
                    <input type = "text" onChange={(event) => {setSchool(event.target.value);}} />   
                </label>
                <input type = "submit"/>
            </form>

            
            <h1>{username}</h1>
    
            {chatList.map((chat)=>(
                    <li>
                        <button onClick = {()=>{
                            setChatInfo(`${chat.chatId}-${username}`);
                            setEnterChat(true);
                        }}>
                            {chat.chatId}                     
                        </button>
                    </li>
                    
                ))}
    
        </div>
        </body>

        
    );
}else{
    return(
        <div>
            <Router>
                <Redirect to={`${url}/${chatInfo}`}/>
                <Routes>
                    <Route path = {`${path}/:chatInfo`}>
                        <ChatRoom/>
                    </Route>
                </Routes>
            </Router>
        </div>
    )
}


}

export default UserProfile;