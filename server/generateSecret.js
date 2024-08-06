const crypto = require('crypto');
const secretKey = crypto.randomBytes(64).toString('hex');
console.log('Your new JWT_SECRET is:');
console.log(secretKey);