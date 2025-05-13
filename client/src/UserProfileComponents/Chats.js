import React from 'react';

import { render } from 'react-dom';
import {useState, useEffect, useLayoutEffect} from 'react';
import Axios from 'axios'
import {BrowserRouter as Router, Switch, Route, useParams, useRouteMatch,Redirect, Link, Switch as Routes} from 'react-router-dom';
import Pusher from 'pusher-js';
import ChatRoom from '../ChatRoom'
function Chats(props){
    const username = props.username;
    const [chatList, setChatList] = useState([])
    
    let {path, url} = useRouteMatch();

    const pusher = new Pusher("ee781780fcff86b28597", {
        cluster: "us3"
    })

    useEffect(()=>{
        console.log(username);
        let isMounted = true;
        if(isMounted){
            Axios.get('http://localhost:3001/chats',{
                params:{
                    username:username
                }
            }).then((response)=>{
                
                setChatList(response.data)
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

    return(
        <div>
            
            {chatList.map((chat)=>(
                <li>
                    <button>
                        <Link to = {`${url}/${chat.chatId}-${username}`}>{chat.chatId} </Link>                       
                    </button>
                </li>
                
            ))}
            <Router>
                <Routes>
                    <Route path = {`${path}/:chatInfo`}>
                        <ChatRoom />
                    </Route>
                </Routes>
        </Router>
        </div>
    );
}

export default Chats;

