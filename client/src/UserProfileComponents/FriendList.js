
import React from 'react';
import './FriendList.css';
import { render } from 'react-dom';
import {useState, useEffect, useLayoutEffect} from 'react';
import Axios from 'axios'
import {BrowserRouter as Router, Switch, Route, useParams} from 'react-router-dom';
import Pusher from 'pusher-js';
function FriendList(props){
    const username = props.username;
    const [friends, setFriends] = useState([]);
    const [newFriend,setNewFriend] = useState("");
    const pusher = new Pusher("ee781780fcff86b28597", {
        cluster: "us3"
    })
    useEffect(()=>{
        let isMounted = true;
        if(isMounted){
            Axios.get('http://localhost:3001/FriendList',{
                params :{
                    username: username
                }
            }).then((response) =>{
                setFriends(response.data);
                console.log(friends);
            })
        }
        return (()=>isMounted = false)
    },[])

    useEffect(() =>{
        let isMounted = true;
        if(isMounted){
            const channel = pusher.subscribe(`channel-friends-${username}`);
            channel.bind("newFriend", (data)=>{
                console.log("success");
                setFriends(currentArray => [...currentArray, data.friend]);
            })
        }

        return(()=> isMounted = false)
    },[])

    function createChat(friend){
        const members = [username, friend];
        Axios.post('http://localhost:3001/createChat',{
            members:members
        }).then((response)=>{
            console.log(response);
        })
    }

    function addFriend(){

        Axios.post('http://localhost:3001/addFriend',{
            username: username,
            friend: newFriend
        }).then((response) =>{
            console.log(response.data);
        });
    }

    function searchActivate(entry){
        console.log(entry);
    }
    return(
        <div className = "FriendList">
            <div>
                <input type = "text" placeHolder = "Search" onChange = {(event)=>searchActivate(event.target.value)}/>
            </div> 
            {friends.map((friend)=>(
                <div> 
                    <button className = "Friend" onClick = {()=>createChat(friend)}>{friend}</button>
                </div>
                
            ))}

                <input type = "text" placeHolder = "Add Friend" onChange = {(event)=> {setNewFriend(event.target.value);}}/>        
                <button onClick = {addFriend}>
                    Add
                </button>
        </div>
    )
}

export default FriendList;