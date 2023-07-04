const SHA256 = require('crypto-js/sha256')


class Block {
    constructor(index, timestamp, data, previousHash = '') {
        this.index = index;
        this.timestamp = timestamp;
        this.data = data;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
        this.nonce = 0;
    }
    calculateHash() {
        return SHA256(this.index + this.timestamp + this.previousHash + JSON.stringify(this.data) + this.nonce).toString() ;

    }
    mineBlock(difficulty) { 
        while(this.hash.substring(0,difficulty) !== Array(difficulty + 1). join("0")) { 
            this.nonce++;  
            this.hash = this.calculateHash(); 
        }
        console.log("block mined: ", this.hash); 
    }

}

class blockchain {
    constructor() {
        this.chain = [this.createGenesisBlock()];
        this.difficulty = 2;
    }

    createGenesisBlock() {
        return new Block(0, "03/07/2023", "Genesis Block", "0");
    }
    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }
    addBlock(newBlock) {
        newBlock.previousHash = this.getLatestBlock().hash; 
        newBlock.mineBlock(this.difficulty);
        this.chain.push(newBlock);
    }
    isChainValid() {
        for(let i = 1; i < this.chain.length; i++) {//i starts from 1 because o stands for genesis block
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i-1];
            if (currentBlock.hash !== currentBlock.calculateHash()) {
                return false; 
            }
            if (currentBlock.previousHash !== previousBlock.hash) {
                return false; 
            }
            return true;

        }
    }

}

let gin = new blockchain() 

console.log("mining bloc 1...");
gin.addBlock(new Block(1, "03/07/2023", {amomunt: 5 }));

console.log("mining bloc 2...");
gin.addBlock(new Block(2, "03/07/2023", {amomunt: 10 }));

console.log("is blockchain valid " ,gin.isChainValid())

console.log(JSON.stringify(gin,null,4));