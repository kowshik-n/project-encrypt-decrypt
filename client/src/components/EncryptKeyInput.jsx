import React, { useState } from 'react';

const EncryptKeyInput = ({ onSubmit, buttonText = "Submit" }) => {
    const [secretKey, setSecretKey] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(secretKey);
        setSecretKey('');
    };

    return (
        <form onSubmit={handleSubmit} className="flex gap-2">
            <input
                type="text"
                value={secretKey}
                onChange={(e) => setSecretKey(e.target.value)}
                placeholder="Enter secret key"
                className="px-3 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button 
                type="submit"
                className="px-4 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
                {buttonText}
            </button>
        </form>
    );
};

export default EncryptKeyInput; 