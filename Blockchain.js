const SHA256 = require('crypto-js/sha256');
const EC = require('elliptic').ec; 
const e = new EC('secp256k1');



// this class handles all the transactions including their origin and recipent addresses 

class transactions {

    //this constructor defines the properties of each transactions
    constructor(fromAddress, toAddress, amount) {
        this.fromAddress = fromAddress;
        this.toAddress = toAddress;
        this.amount = amount; 
    }

    //this calculates the hash value of each transaction using its properties.
    calculateHash() {
        return SHA256(this.fromAddress + this.toAddress + this.amount).toString();
    }

    //this function aims to sign each transaction iff they are valid and done using the correct key
    signTransactions(signingKey) {
        if(signingKey.getPublic('hex') !== this.fromAddress){
            throw new Error('you can not sign other wallets' );
        }

        const hashTransaction = this.calculateHash();
        const sig = signingKey.sign(hashTransaction, 'base64');
        this.signature = sig.toDER('hex');
    }

    //this function checks the validity of each transaction. This will be used as a check. and the process will only move further if this yields true.
    Validity() {
        if (this.fromAddress == null) return true;
        if (!this.signature || this.signature.length === 0 ) { 
            throw new Error('No signature in this transaction ');
        }
        const publicKey = EC.keyFromPublic(this.fromAddress, 'hex');
        return publicKey.verify(this.calculateHash(), this.signature);
    }
}


//The Block class includes the following properties:  index, timestamp, data (the variable transactions is used instead of data), previous hash, and current hash.

class Block {
    constructor(index,timestamp, transactions, previousHash = '') {
        this.index = index;
        this.timestamp = timestamp;
        this.transactions = transactions;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
        this.nonce = 0;     // Nonce variable is used to refer the cryptographic number used to increase difficulty in creating hash.
    }

    //this function calculates the hash value of the block using its properties. 
    calculateHash() {
        return SHA256(this.index + this.timestamp + this.previousHash + JSON.stringify(this.transactions) + this.nonce).toString() ;

    }

    //mineBlock() mines each block and adds the difficulty in the starting of each hash 
    //Adding difficulty in each hash increases the time taken to create that hash value.
    //in this code difficulty is set to 5. decreasing this value will make hash generation faster.
    mineBlock(difficulty) { 
        while(this.hash.substring(0,difficulty) !== Array(difficulty + 1). join("0")) { 
            this.nonce++;  
            this.hash = this.calculateHash(); 
        }
        console.log("block mined: ", this.hash); 
    }


    ValidTransactions() {
        for (const t of  this.transactions) { 
            if (!t.Validity()) {
                return false; 
            }
        }
    }

}


//This class represents the main blockchain
class blockchain {
    constructor() {
        this.chain = [this.createGenesisBlock()];
        this.difficulty = 5;        //difficulty is set so that creating hash takes a bit time. and someone can't manipulate data easily.
        this.pendingTransactions = [];
        this.miningReward = 500;
    }


    //Genesis block refers to the first block
    //this function creates the genesis block
    createGenesisBlock() {
        return new Block(0, "03/07/2023", "Genesis Block", "0");
    }

    
    //this function retrieves the last created block in the blockchain
    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }


    //this is the old method in which implemented the adding of blocks
    /*
    addBlock(newBlock) {
        newBlock.previousHash = this.getLatestBlock().hash;
        newBlock.mineBlock(this.difficulty);
        this.chain.push(newBlock);
    }
    */


    //this function replaced the addBlock() function which is just above it.
    minePendingTransactions(miningRewardAddress) {
        let block = new Block(Date.now(), this.pendingTransactions);
        block.mineBlock(this.difficulty); 

        console.log("block succesfully mined");
        this.chain.push(block);

        this.pendingTransactions = [
            new transactions(null, miningRewardAddress, this.miningReward)
        ];
    }



    //this checks the validity of the transaction and if its valid then it is processed.
    createTransaction(transaction) {
        if (!transaction.fromAddress || !transactions.toAddress) {
            throw new Error("transactions must have address");
        }
        if (!transactions.Validity()){
            throw new Error("invalid transaction ");    
        }

        this.pendingTransactions.push(transaction);    
    }


    //this function is supposed to return the balance of the user after each transaction 
    //However this function has an error in the nested looping. I was not able to resolve it and it has created issue for further linked functions.
    getBalanceOfAddress(address) {
        let balance = 0; 
        for (const block of this.chain) {
            for (const trans of block.transactions) {
                if(trans.fromAddress === address) {
                    balance -= trans.amount; 
                }
                if (trans.toAddress === address) {
                    balance += trans.amount;
                }
            }
        }
        return balance; 
    }



    //Checks the validity of each chain created
    isChainValid() {
        for(let i = 1; i < this.chain.length; i++) {//i starts from 1 because o stands for genesis block
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i-1];
            if (currentBlock.hash !== currentBlock.calculateHash() || (!currentBlock.ValidTransactions()) || (currentBlock.previousHash !== previousBlock.hash)) {
                return false;
            }
            return true;

        }
    }

}



//to export the modules and use them in other scripts.
module.exports.blockchain = blockchain;
module.exports.transactions = transactions; 