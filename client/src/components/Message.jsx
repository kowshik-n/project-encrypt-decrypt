import React, { useState } from 'react';
import { MdLock, MdLockOpen } from 'react-icons/md';
import EncryptKeyInput from './EncryptKeyInput';

const Message = ({ message, isOwnMessage, socket }) => {
    const [decryptedText, setDecryptedText] = useState(null);
    const [showDecrypt, setShowDecrypt] = useState(false);
    const [error, setError] = useState(null);

    const handleDecrypt = (secretKey) => {
        socket.emit('decrypt message', {
            messageId: message._id,
            encryptedText: message.text,
            secretKey: secretKey
        });

        socket.once('decrypted message', ({ messageId, decryptedText }) => {
            if (messageId === message._id) {
                setDecryptedText(decryptedText);
                setShowDecrypt(false);
                setError(null);
            }
        });

        socket.once('decrypt error', ({ messageId, error }) => {
            if (messageId === message._id) {
                setError(error);
                setShowDecrypt(true); // Keep form visible on error
            }
        });
    };

    return (
        <div className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} mb-4`}>
            <div 
                className={`max-w-[70%] ${
                    isOwnMessage 
                        ? 'bg-blue-500 text-white' 
                        : 'bg-gray-200'
                } rounded-lg p-3 shadow-sm`}
            >
                {message.isEncrypted && (
                    <div className={`flex items-center gap-1 mb-1 text-sm ${
                        isOwnMessage ? 'text-blue-100' : 'text-gray-600'
                    }`}>
                        {decryptedText ? <MdLockOpen /> : <MdLock />}
                        <span>{decryptedText ? 'Decrypted' : 'Encrypted Message'}</span>
                    </div>
                )}
                
                <p className="break-words">
                    {message.isEncrypted 
                        ? (decryptedText || '🔒 This message is encrypted') 
                        : message.text
                    }
                </p>

                {message.isEncrypted && !decryptedText && (
                    <div className="mt-2">
                        {showDecrypt ? (
                            <div className={`p-2 rounded ${
                                isOwnMessage ? 'bg-blue-600' : 'bg-white'
                            }`}>
                                <EncryptKeyInput 
                                    onSubmit={handleDecrypt} 
                                    buttonText="Decrypt" 
                                />
                                {error && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {error}
                                    </p>
                                )}
                            </div>
                        ) : (
                            <button
                                onClick={() => setShowDecrypt(true)}
                                className={`text-sm ${
                                    isOwnMessage 
                                        ? 'text-blue-100 hover:text-white' 
                                        : 'text-blue-500 hover:text-blue-600'
                                } underline`}
                            >
                                Decrypt message
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Message; 