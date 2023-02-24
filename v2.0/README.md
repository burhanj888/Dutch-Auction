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

Nothing to compile
No need to generate any newer typings.

Network Info
============
> HardhatEVM: v2.11.1
> network:    hardhat



  Tests
    Mint ERC721 Token
      ✔ safMint successfully by the owner (522ms)
      ✔ should revert when non-owner tries to safely mint a token (48ms)
      ✔ should revert when maximum token supply is reached (150ms)
      ✔ Mint Successfully and Deploy Auction's Contract (144ms)

  Without Approval
    ✔ should revert when the seller tries to bid without approval (39ms)
    ✔ should revert when the other account tries to bid without approval (39ms)
    ✔ should revert when the seller tries to approve with invalid TokenID
    ✔ should revert when the other account try to approve
    ✔ After Approval

  Bid - With Approval
    ✔ should revert when a bid is placed with Insufficient Funds
    ✔ Bid placed successfully by other
    ✔ should revert when a bid is placed after auction is closed


  12 passing (1s)

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