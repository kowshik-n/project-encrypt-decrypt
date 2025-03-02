const CryptoJS = require('crypto-js');

const encryptMessage = (message, secretKey) => {
    try {
        const encrypted = CryptoJS.AES.encrypt(message, secretKey).toString();
        return encrypted;
    } catch (error) {
        console.error('Encryption error:', error);
        return null;
    }
};

const decryptMessage = (encryptedMessage, secretKey) => {
    try {
        const decrypted = CryptoJS.AES.decrypt(encryptedMessage, secretKey);
        return decrypted.toString(CryptoJS.enc.Utf8);
    } catch (error) {
        console.error('Decryption error:', error);
        return null;
    }
};

module.exports = {
    encryptMessage,
    decryptMessage
}; 