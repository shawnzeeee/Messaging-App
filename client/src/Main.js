
import React, { useEffect } from 'react';

import { render } from 'react-dom';
import {useState} from 'react';
import Axios from 'axios'
import {BrowserRouter as Router, Switch, Route, useParams, useRouteMatch, Redirect, Link, Switch as Routes} from 'react-router-dom';
import FriendList from './UserProfileComponents/FriendList';
import Chats from './UserProfileComponents/Chats';
import ChatRoom from'./ChatRoom';
import Pusher from 'pusher-js';
function Main(props){

    const[state, setState] = useState("MAIN");
    const username = props.username;
    let{userId} = useParams();

    let {path, url} = useRouteMatch();

    useEffect(()=>{
        Axios.get('http://localhost:3001/posts', {
            params:{
                username:username
            }
        }).then((response)=>{
    
        });
    },[])


    if (state == "MAIN"){
        return(
            <div>
                <div>
                    <h1>Slink</h1>
                </div>
                <div>
                    <button onClick = {()=>setState("INBOX")}>
                        Inbox
                    </button>
                </div>
            </div>
        );
    }else if(state == "INBOX"){
        <Router>
            <Redirect to = {`${url}/inbox`}/>
            <Routes>
                <Route path = {`${path}/inbox`}>
                    
                </Route>
            </Routes>
        </Router>
    }
}

export default Main;