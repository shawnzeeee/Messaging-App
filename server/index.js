//const dbUser = require("./dbUser");
//const express = require("express");
//const cors = require("cors");
//const mongoose = require("mongoose");
//const pusher = require("pusher")
import dbUser from "./dbUser.js";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import Pusher from "pusher";
import uuid from 'uuidv4';
import dbChats from "./dbChats.js";
import multer from "multer";
import { S3  } from "@aws-sdk/client-s3";
import fs from "fs";
import "dotenv";

const app = express();

const upload = multer({dest: 'uploads/'})

const bucketName = process.env.AWS_BUCKET_NAME;
const region = process.env.AWS_BUCKET_REGION;
const accessKeyId = process.env.AWS_ACCESS_KEY;
const secretAccessKey = process.env.AWS_SECRET_KEY;

const pusher = new Pusher({
    appId: '1331891',
    key: 'ee781780fcff86b28597',
    secret: '809a9b9011ad96ff3aec',
    cluster: 'us3'
  
});


app.use(express.json());
app.use(cors());


mongoose.connect('mongodb+srv://shawnxie0125:Alh840019843@cluster0.au9fx.mongodb.net/appDB?retryWrites=true&w=majority',
{useNewUrlParser: true,
    useUnifiedTopology: true, }, 
()=>{
    console.log("Success");
});

mongoose.connection.on("open", () =>{
    console.log("DB Connected");
    const accountChange = mongoose.connection.collection('users').watch();  //watches if any changes happen on the collection account

    accountChange.on('change', (change)=>{
        //console.log(change);  //Each change contains different operation types
        const accountDetails = change.fullDocument;
        //console.log(accountDetails);
        if(change.operationType === 'insert'){
            if(accountDetails.username.length != 0 && accountDetails.password.length != 0){
                console.log("Account inserted");
                
            }
        }
        /*
        if(change.operationType === 'update'){
            const updateDetails = change.updateDescription.updatedFields;
            console.log(change);
            let updateDetailsStr = JSON.stringify(updateDetails);
            let firstIndex = updateDetailsStr.indexOf('"',13);
            const friendUsername = updateDetailsStr.substring(firstIndex+1, updateDetailsStr.indexOf('"',firstIndex+1));
            updateDetailsStr = updateDetailsStr.substring(2,9);
            if(updateDetailsStr == "friends"){
                console.log("Friend has been added");
                
                pusher.trigger('channel-users', 'addFriend', {
                    friend: friendUsername
                })
                    
                
            }
        }
        */


    })

    
    
})



app.post('/pusher/auth', (req,res)=>{
    const socketId = req.body.socket_id;
    const channel = req.body.channel_name;
    const presenceData = {
        user_id: uuid(),
        user_info: {username}
    };
    const auth = pusher.authenticate(socketId, channel, presenceData);
    res.send(auth);
})

app.post('/CreateAccount',(req,res)=>{
    const body = req.body;
    const username = req.body.username;
    const password = req.body.password;
    dbUser.findOne({
        username: req.body.username
        },
        (err,result)=>{
        if(err){
            console.log(error);
        }else{
            if(result != null){
                console.log(result);
                res.send("User name already exists");
            }else{
                dbUser.create({username: username, password:password, friends:[]}, (err, data) =>{
                    if(err){
                        console.log(err);
                    }else{
                        res.send(data)
                    }
                })
            }
        }
    })

})

app.post('/SignIn', (req,res)=>{
    dbUser.findOne({
        username: req.body.username
    }, (err,result)=>{
        if(err){
            console.log(err);
        }else{
            if(result != null){
                if(result.password == req.body.password){
                    res.send(result);
                }else{
                    res.send("Incorrect Password")
                }
            }else{
                res.send("User name does not exist")
            }
        }
    })
        
    
})

app.get('/FriendList', (req, res)=>{
    const username = req.query.username;
    dbUser.findOne({
        username: req.query.username
    }, (err, result)=>{
       
        if(err){
            console.log(err);
        }else{
            
            if(result.friends == null){
                res.send([]);
            }else{
                res.send(result.friends);
            }

        }
    })
})

app.post('/addFriend', (req,res) =>{
    const username = req.body.username;
    const friend = req.body.friend;
    dbUser.findOne({
        username: friend
    },(err,result)=>{
        if(err){
            console.log(err);
        }else{
            if(result == null){
                res.send("User does not exist");
            }else{
                dbUser.findOneAndUpdate({
                    username: username
                }, {$push: { 
                    friends: friend
                }}, (err, result)=>{
                    if (err){
                        console.log(err);
                    }else{
                        pusher.trigger(`channel-friends-${username}`, "newFriend",{
                            friend:friend
                        })
                    }
                })
                dbUser.findOneAndUpdate({
                    username: friend
                }, {$push: { 
                    friends: username
                }}, (err, result)=>{
                    if (err){
                        console.log(err);
                    }else{
                        pusher.trigger(`channel-friends-${friend}`, "newFriend",{
                            friend: username
                        })
                    }
                })
            }
        }
    })

    
})

app.get('/chats', (req,res)=>{
    const username = req.query.username;
    dbUser.findOne({
        username:username
    }, (err,result)=>{
        if(err){
            console.log(err);
        }else{
            console.log(result.chats);
            res.send(result.chats);
        }
    })
})

app.post('/uploadImage', upload.single('image'), (req,res)=>{
    const file = req.file;
    
})
app.get('/chatRoom',(req,res)=>{
    //const chatId = mongoose.Types.ObjectId(req.query.chatId);
    const chatId = String(req.query.chatId);
    console.log(chatId);
    dbChats.findById(chatId).exec((err,result)=>{
        if(err){
            console.log(err);
        }else{
            console.log(result);
            res.send(result);
        }
    })
})

app.post('/createChat', (req,res)=>{
    const members = req.body.members;
    let channel = [];
    dbChats.create({
        members: members
    },(err,data)=>{
        if(err){
            console.log(err);
        }else{
            members.map((member)=>(
                dbUser.findOneAndUpdate({
                    username:member
                },{$push:{
                    chats:{
                        chatId: data._id,
                        members:members
                    }
                }},(err,result)=>{
                    if(err){
                        console.log(err);
                    }else{
                        
                       // channel = currentArray=>[...currentArray,`$channel-newChat-${member}`];
                        channel = channel.concat(`channel-newChat-${member}`);
                       // console.log(`${channel[0]} ${channel[1]}`);
                        pusher.trigger(`channel-newChat-${member}`, "newChat",{
                            chatId:data._id,
                            members:members
                        })
                        //res.send("New chat created")
                    }
                })
            ))
            //pusher.trigger(channel, "newChat",{
               // chatId:data._id,
             //   members:members
           // })   
             res.send("New Chat Created");
        }
    })
})

app.post('/sendMessage',(req,res)=>{
    const username = req.body.username;
    const chatId = req.body.chatId;
    const message = req.body.message;
    const messageType = req.body.messageType;
    dbChats.findOneAndUpdate({
        _id: chatId
    },{$push:{
        messages:{
            username:username,
            message:message,
            messageType: messageType
        }
    }}, (err,result)=>{
        if(err){
            console.log(err);
        }else{
            res.send("Message has been sent and stored");
            pusher.trigger(`channel-chats-${chatId}`, "newMessage",{
                username:username,
                message:message,
                messageType:messageType
            })
        }
    })
})

app.post('/sendImage', upload.single('image'), (req,res)=>{
    console.log(bucketName);
    const username = req.body.username;
    const chatId = req.body.chatId;
    const file = req.body.file;
    console.log(file);
    const fileStream = fs.createReadStream(file);
    const uploadParams = {
        Bucket: bucketName,
        Body: fileStream,
        Key: file.filename
    }

    S3.upload({
            uploadParams
        },(err,result)=>{
            if(err){
                console.log(err);
            }else{
                res.send("Image has been store in S3 Bucket");
                const imageId = result.key;
                dbChats.findOneAndUpdate({
                    _id: chatId        
                },{$push:{
                    messages:{
                        username:username,
                        message: imageId,
                        type: "image"
                    }
                }},(err,result)=>{
                    if(err){
                        console.log(err);
                    }else{
                        res.send("ImageID has been uploaded to mongoDB");
                    }
                })
            }
        })

})
app.listen(3001, ()=>{
    console.log("Server runnning on port 3001")
})