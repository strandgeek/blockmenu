# Quickstart Guide for BlockMenu Contract

This project builds a smart contract for BlockMenu on BitTorrent-Chain using Hardhat and OpenZeppelin.

## Prerequisites

- Node.js (version 14 or later)

## Installation

1 - Install dependencies:

```sh
cd contract
npm install
```

2 - Compile the smart contract:

```
npm run compile
```

> When you compile a code the contract JSON is copied to the webapp so the deployer UI will use the most recent compiled version.

3 - Test the contract:

```
npm test
```

Also, you can use the hardhard commands:

```sh
npx hardhat help
npx hardhat test
npx hardhat node
```
