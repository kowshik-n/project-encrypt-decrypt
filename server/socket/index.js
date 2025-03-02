const express = require('express')
const { Server } = require('socket.io')
const http  = require('http')
const getUserDetailsFromToken = require('../helpers/getUserDetailsFromToken')
const UserModel = require('../models/UserModel')
const { ConversationModel,MessageModel } = require('../models/ConversationModel')
const getConversation = require('../helpers/getConversation')
const { encryptMessage, decryptMessage } = require('../helpers/encryption')

const app = express()

/***socket connection */
const server = http.createServer(app)
const io = new Server(server,{
    cors : {
        origin : process.env.FRONTEND_URL,
        credentials : true
    }
})

/***
 * socket running at http://localhost:8080/
 */

//online user
const onlineUser = new Set()

io.on('connection',async(socket)=>{
    console.log("connect User ", socket.id)

    const token = socket.handshake.auth.token 
    let user;

    try {
        user = await getUserDetailsFromToken(token)
        
        if (user && user._id) {
            socket.join(user._id.toString())
            onlineUser.add(user._id.toString())
            io.emit('onlineUser', Array.from(onlineUser))
        }
    } catch (error) {
        console.error("Error getting user details:", error)
        return
    }

    socket.on('message-page',async(userId)=>{
        try {
            const userDetails = await UserModel.findById(userId).select("-password")
            
            const payload = {
                _id : userDetails?._id,
                name : userDetails?.name,
                email : userDetails?.email,
                profile_pic : userDetails?.profile_pic,
                online : onlineUser.has(userId)
            }
            socket.emit('message-user',payload)

            //get previous message
            const getConversationMessage = await ConversationModel.findOne({
                "$or" : [
                    { sender : user?._id, receiver : userId },
                    { sender : userId, receiver :  user?._id}
                ]
            }).populate('messages').sort({ updatedAt : -1 })

            socket.emit('message',getConversationMessage?.messages || [])
        } catch (error) {
            console.error("Error in message-page:", error)
        }
    })

    socket.on('new message',async(data)=>{
        try {
            let conversation = await ConversationModel.findOne({
                "$or" : [
                    { sender : data?.sender, receiver : data?.receiver },
                    { sender : data?.receiver, receiver :  data?.sender}
                ]
            })

            if(!conversation){
                const createConversation = await ConversationModel({
                    sender : data?.sender,
                    receiver : data?.receiver
                })
                conversation = await createConversation.save()
            }
            
            let messageText = data.text;
            let isEncrypted = false;

            if (data.encrypt && data.secretKey) {
                messageText = encryptMessage(data.text, data.secretKey);
                isEncrypted = true;
            }
            
            const message = new MessageModel({
                text: messageText,
                isEncrypted: isEncrypted,
                imageUrl: data.imageUrl || "",
                videoUrl: data.videoUrl || "",
                msgByUserId: data?.msgByUserId,
            });
            const saveMessage = await message.save()

            await ConversationModel.updateOne({ _id : conversation?._id },{
                "$push" : { messages : saveMessage?._id }
            })

            const getConversationMessage = await ConversationModel.findOne({
                "$or" : [
                    { sender : data?.sender, receiver : data?.receiver },
                    { sender : data?.receiver, receiver :  data?.sender}
                ]
            }).populate('messages').sort({ updatedAt : -1 })

            io.to(data?.sender).emit('message',getConversationMessage?.messages || [])
            io.to(data?.receiver).emit('message',getConversationMessage?.messages || [])

            const conversationSender = await getConversation(data?.sender)
            const conversationReceiver = await getConversation(data?.receiver)

            io.to(data?.sender).emit('conversation',conversationSender)
            io.to(data?.receiver).emit('conversation',conversationReceiver)
        } catch (error) {
            console.error("Error in new message:", error)
        }
    })

    socket.on('decrypt message', async(data) => {
        try {
            const decryptedText = decryptMessage(data.encryptedText, data.secretKey);
            if (decryptedText) {
                socket.emit('decrypted message', {
                    messageId: data.messageId,
                    decryptedText: decryptedText
                });
            } else {
                socket.emit('decrypt error', {
                    messageId: data.messageId,
                    error: 'Invalid decryption key'
                });
            }
        } catch (error) {
            socket.emit('decrypt error', {
                messageId: data.messageId,
                error: 'Decryption failed'
            });
        }
    });

    socket.on('sidebar',async(currentUserId)=>{
        try {
            const conversation = await getConversation(currentUserId)
            socket.emit('conversation',conversation)
        } catch (error) {
            console.error("Error in sidebar:", error)
        }
    })

    socket.on('seen',async(msgByUserId)=>{
        try {
            if (!user?._id) return;

            let conversation = await ConversationModel.findOne({
                "$or" : [
                    { sender : user._id, receiver : msgByUserId },
                    { sender : msgByUserId, receiver :  user._id}
                ]
            })

            const conversationMessageId = conversation?.messages || []

            await MessageModel.updateMany(
                { _id : { "$in" : conversationMessageId }, msgByUserId : msgByUserId },
                { "$set" : { seen : true }}
            )

            const conversationSender = await getConversation(user._id.toString())
            const conversationReceiver = await getConversation(msgByUserId)

            io.to(user._id.toString()).emit('conversation',conversationSender)
            io.to(msgByUserId).emit('conversation',conversationReceiver)
        } catch (error) {
            console.error("Error in seen:", error)
        }
    })

    socket.on('disconnect',()=>{
        if (user?._id) {
            onlineUser.delete(user._id.toString())
            io.emit('onlineUser',Array.from(onlineUser))
        }
        console.log('disconnect user ',socket.id)
    })
})

module.exports = {
    app,
    server
}

