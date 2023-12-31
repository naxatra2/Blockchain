const EC = require('elliptic').ec; 
const e = new EC('secp256k1');

const key = e.genKeyPair();
const publicKey = key.getPublic('hex');
const privateKey= key.getPrivate('hex');

console.log();
console.log('private key: ', privateKey);

console.log();
console.log('public key: ', publicKey);
