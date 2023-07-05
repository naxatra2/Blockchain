const { blockchain, transactions } = require("./Blockchain");
const EC = require('elliptic').ec; 
const ec = new EC('secp256k1');


const myKey = ec.keyFromPrivate('221053f4012ad177c56b2d16569213cdb771cfecc4826da619551a0b6c0929c6');
const myWalletAddress = myKey.getPublic('hex');


let gin = new blockchain() 


const t = new transactions(myWalletAddress, '04421a373a2e0d7d6827f659482b41455b5634828cecdfdafcbda38ff5bd6156b424a25bc0219c643aa51e9fad9b4bf7309a9b2c75d0f2990fb3190bfd7d8bfe3b', 10); // i have taken a random public key, but the real public key should go here 
t.signTransactions(myKey); 
gin.createTransaction(t); 


gin.createTransaction(new transactions( 1,'address1', 'address2', 100));
gin.createTransaction(new transactions( 1,'address2', 'address1', 50));

console.log("\nstarting the miner ...");
gin.minePendingTransactions('gin-Addres');

console.log("\nstarting the miner again ...");
gin.minePendingTransactions('gin-Addres');

console.log("\nThe balance of gins is ", gin.getBalanceOfAddress('gin-Address'));