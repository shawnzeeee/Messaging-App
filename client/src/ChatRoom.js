
import React, { useEffect } from 'react';
import "./ChatRoom.css";
import { render } from 'react-dom';
import {useState} from 'react';
import Axios from 'axios'
import {BrowserRouter as Router, Switch, Route, useParams, useRouteMatch, Redirect, Link, Switch as Routes} from 'react-router-dom';
import Pusher from 'pusher-js';

function ChatRoom(){

    let{chatInfo} = useParams();
    let {path, url} = useRouteMatch();

    const chatParams = chatInfo.split("-");
    const [username, setUsername] = useState(chatParams[1]);
    const [chatId, seChatId] = useState(chatParams[0]);
    const[messages, setMessages] = useState([]);
    const [userFile, setUserFile] = useState('');
    const[userFileName, setUserFileName] = useState('');

    const[userMessage, setUserMessage] = useState("");

    const pusher = new Pusher("ee781780fcff86b28597", {
        cluster: "us3"
    })

    useEffect(()=>{
        console.log(`${username}  ${chatId}`);
        Axios.get('http://localhost:3001/chatRoom',{
            params:{
                chatId: chatId,
                
            }
        }).then((response)=>{
            console.log(response);
            setMessages(response.data.messages.reverse());
        })
        console.log(messages);
    },[]);

    useEffect(()=>{
        let isMounted = true;
        if(isMounted){
            const channel = pusher.subscribe(`channel-chats-${chatId}`);
            channel.bind("newMessage", (data)=>{
                setMessages(currentArray => [{
                    username: data.username,
                    message: data.message,
                    type: data.type},...currentArray])
                
            })
            
        }
        
        return (()=>isMounted = false)
    },[])


    const sendMessage = ()=>{
        Axios.post('http://localhost:3001/sendMessage',{
            username:username,
            chatId: chatId,
            message:userMessage,
            messageType: "string"
        }).then((response)=>{
            console.log(response.data);
        }) 

    }


    return(
        <div>
            <h1>
                ChatRoom
            </h1>
            <div className = "Messages">
            {messages.map((message)=>(
            <div>
                {
                    message.username === username
                        ?<div className = "UserMessage-wrap">
                        <label>{message.username}</label>
                        <div className = "UserMessage">
                        <p>{message.message}</p>
                        </div>
                        </div>                    
                        :<div className = "OtherMessage-wrap">
                        <label>{message.username}</label>
                        <div className = "OtherMessage">
                            <p>{message.message}</p>
                        </div>
                        
                        </div>
                    
                }

            
                
            </div>
            ))}
           </div> 
                
                <input className = "Text" placeholder = "Enter Message Here" onChange={(event)=>{setUserMessage(event.target.value)}}/>
                <input type = "file" onChange = {(event)=>{setUserFile(event.target.files[0]); setUserFileName(event.target.files[0].name)}}/>  
                    <button onClick = {sendMessage}>
                        Send
                    </button>
               

                
                
            
        </div>
    );
}

export default ChatRoom;