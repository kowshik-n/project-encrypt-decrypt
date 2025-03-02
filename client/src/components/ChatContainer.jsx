import React, { useState, useEffect, useRef } from 'react';
import Message from './Message';
import MessageInput from './MessageInput';

const ChatContainer = ({ selectedUser, socket, currentUser }) => {
    const [messages, setMessages] = useState([]);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        if (selectedUser?._id && socket) {
            // Listen for new messages
            socket.on('message', (newMessages) => {
                setMessages(newMessages || []);
            });

            // Request messages for selected user
            socket.emit('message-page', selectedUser._id);
        }

        return () => {
            if (socket) {
                socket.off('message');
            }
        };
    }, [selectedUser, socket]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = ({ text, encrypt, secretKey }) => {
        if (!text.trim() || !selectedUser?._id || !currentUser?._id) return;

        socket.emit('new message', {
            text,
            encrypt,
            secretKey,
            sender: currentUser._id,
            receiver: selectedUser._id,
            msgByUserId: currentUser._id
        });
    };

    return (
        <div className="flex-1 flex flex-col h-full">
            {selectedUser ? (
                <>
                    <div className="p-4 border-b bg-white">
                        <h2 className="font-semibold">{selectedUser?.name}</h2>
                        <p className="text-sm text-gray-500">{selectedUser?.email}</p>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4">
                        {messages.map((message) => (
                            <Message
                                key={message._id}
                                message={message}
                                isOwnMessage={message.msgByUserId === currentUser?._id}
                                socket={socket}
                            />
                        ))}
                        <div ref={messagesEndRef} />
                    </div>

                    <MessageInput onSendMessage={handleSendMessage} />
                </>
            ) : (
                <div className="flex-1 flex items-center justify-center">
                    <p className="text-gray-500">Select a user to start chatting</p>
                </div>
            )}
        </div>
    );
};

export default ChatContainer; 