const crypto = require('crypto');
const algorithm = 'aes-256-ctr';
let key = 'secretkey';
key = crypto
    .createHash('sha256')
    .update(key)
    .digest('base64')
    .substr(0, 32);

// ENCRYPTION METHOD
module.exports = function(buffer) {
    console.log('BEFORE ENCRYPTION', buffer);
    const iv = crypto.randomBytes(16);
    // Create a new cipher using the algorithm, key, and iv
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    // Create the new (encrypted) buffer
    const encrypted = Buffer.concat([
        iv,
        cipher.update(buffer),
        cipher.final()
    ]);
    console.log('ENCRYPTED', encrypted);
    return encrypted;
};
