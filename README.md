### Blockchain
This repository is for the task submission of KBS.

# Blockchain  system
In this project I have tried to replicate a basic blockchain system where users can create transactions and it will also show their balance in the account after each transaction. 

**checklists (things I accomplished) :**
- [x] Design the Blockchain Structure ( created classes for Block, Blockchain, Transactions and a hashing algorithm)
- [x] Implement Block Creation and Chain Validation (Creating and validating each block that will be added in the blockchain)
- [x] Implement Basic Consensus Algorithm (I have created functions to mine blocks and also give rewards miners)
- [ ] Transaction Management (Signing each transaction and having a basic info on who is doing transaction to whom and keeping its record).

# Transaction Mangaement

The first error occured at the I tried to implement a key based system where users can do transactions using their personal keys (i.e they can only do transactions using their key and someone else's. otherwise it will throw an error. To implement this specific functions, I found a [Youtube tutorial](https://www.youtube.com/watch?v=kWQ84S13-hw&t=909s) after which I used the elliptic library for JS. This is the part which has caused issue in the code. after importing the library and changing the code to adjust it. It has created issues. so signing transactions is not implemented correctly.


