import React, { useState } from 'react';
import { IoMdSend } from 'react-icons/io';
import { MdLockOutline } from 'react-icons/md';

const MessageInput = ({ onSendMessage }) => {
    const [message, setMessage] = useState('');
    const [showEncrypt, setShowEncrypt] = useState(false);
    const [secretKey, setSecretKey] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!message.trim()) return;

        onSendMessage({
            text: message,
            encrypt: showEncrypt,
            secretKey: secretKey
        });

        setMessage('');
        setSecretKey('');
        setShowEncrypt(false);
    };

    return (
        <div className="p-4 border-t">
            {showEncrypt && (
                <div className="mb-2">
                    <input
                        type="text"
                        value={secretKey}
                        onChange={(e) => setSecretKey(e.target.value)}
                        placeholder="Enter encryption key"
                        className="w-full px-3 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
            )}
            <form onSubmit={handleSubmit} className="flex items-center gap-2">
                <button
                    type="button"
                    onClick={() => setShowEncrypt(!showEncrypt)}
                    className={`p-2 rounded-full ${showEncrypt ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'}`}
                    title="Encrypt message"
                >
                    <MdLockOutline size={20} />
                </button>
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                    type="submit"
                    className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600"
                >
                    <IoMdSend size={20} />
                </button>
            </form>
        </div>
    );
};

export default MessageInput; 