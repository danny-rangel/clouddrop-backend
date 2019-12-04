const crypto = require('crypto');
const algorithm = 'aes-256-ctr';
let key = 'secretkey';
key = crypto
    .createHash('sha256')
    .update(key)
    .digest('base64')
    .substr(0, 32);
// DECRYPTION METHOD
module.exports = function(buffer) {
    console.log('BEFORE DECRYPTION', buffer);
    // Get the first 16 bytes
    const iv = buffer.slice(0, 16);
    // Get the rest of the buffer
    encrypted = buffer.slice(16);
    // Create a decipher
    const decipher = crypto.createDecipheriv(algorithm, key, iv);
    // Decrypt
    const decrypted = Buffer.concat([
        decipher.update(encrypted),
        decipher.final()
    ]);
    console.log('AFTER DECRYPTION', decrypted);
    return decrypted;
};
