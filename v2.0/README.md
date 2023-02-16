# Sample Hardhat Project

This project demonstrates a basic Hardhat use case. It comes with a sample contract, a test for that contract, and a script that deploys that contract.

Try running some of the following tasks:

```shell
npx hardhat help
npx hardhat test
REPORT_GAS=true npx hardhat test
npx hardhat node
npx hardhat run scripts/deploy.ts
```

npx hardhat coverage

Version
=======
> solidity-coverage: v0.8.0

Instrumenting for coverage...
=============================

> MyERC721Token.sol
> NFTDutchAuction.sol

Compilation:
============

Generating typings for: 15 artifacts in dir: typechain-types for target: ethers-v5
Successfully generated 44 typings!
Compiled 14 Solidity files successfully

Network Info
============
> HardhatEVM: v2.11.1
> network:    hardhat



  Tests
    Mint ERC721 Token
      ✔ Safe Mint - Owner (511ms)
      ✔ should revert when non-owner tries to safely mint a token (43ms)
      ✔ should revert when maximum token supply is reached (150ms)
      ✔ Mint Successfully and Deploy Auction's Contract (135ms)

  Bid - without approval
    ✔ Bid - By Seller
    ✔ Bid - Without approval (50ms)
    ✔ Approving - Invalid TokenID
    ✔ Approval - Not the owner
    ✔ Approving

  Bid - With Approval
    ✔ Bid - Insufficient Funds
    ✔ Bid - Success
    ✔ should revert when a bid is placed after auction is closed
    ✔ Bid - Closed Auction


  13 passing (1s)

----------------------|----------|----------|----------|----------|----------------|
File                  |  % Stmts | % Branch |  % Funcs |  % Lines |Uncovered Lines |
----------------------|----------|----------|----------|----------|----------------|
 contracts\           |    93.75 |    81.25 |      100 |    92.86 |                |
  MyERC721Token.sol   |      100 |      100 |      100 |      100 |                |
  NFTDutchAuction.sol |    90.91 |       75 |      100 |    90.91 |          60,62 |
----------------------|----------|----------|----------|----------|----------------|
All files             |    93.75 |    81.25 |      100 |    92.86 |                |
----------------------|----------|----------|----------|----------|----------------|

> Istanbul reports written to ./coverage/ and ./coverage.json