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
> solidity-coverage: v0.8.2

Instrumenting for coverage...
=============================

> MyERC20BidToken.sol
> MyERC721NFT.sol
> NFTDutchAuction_ERC20Bids.sol

Compilation:
============

Generating typings for: 33 artifacts in dir: typechain-types for target: ethers-v5
Successfully generated 98 typings!
Compiled 32 Solidity files successfully

Network Info
============
> HardhatEVM: v2.13.0
> network:    hardhat



  Test Cases
    Mint
      ✔ ERC20 Tests - Cap Assertion (139ms)

  ERC20 and ERC721 Tests
    ✔ ERC20 minting by Owner
    ✔ ERC20 minting by Other Account
    ✔ ERC20 - Cap exceeded (61ms)
    ✔ ERC 721 - should revert when maximum token supply is reached (126ms)
    Auction Tests
      ✔ ERC721 - Safe Mint by Owner
      ✔ ERC721 - Safe Mint by Other Account
      ✔ Deploy Dutch Auction Contract (114ms)

  Bids
    ✔ Pre ERC20 Approval
    ✔ ERC20 Permit: Invalid Signature Rejection
    ✔ ERC20 Permit: Wokring

  After approval
    ✔ should revert when the seller is trying to bid
    ✔ should revert when the token is not approved (60ms)
    ✔ should revert when the token id doesn't exist while approving
    ✔ should revert when the approve caller is not the token owner
    ✔ Approved

  Bid After Approval
    ✔ should rever when the bid placed is less than current price
    ✔ should revert when a bid is placed after auction is closed
    ✔ Successful Bid


  19 passing (819ms)

--------------------------------|----------|----------|----------|----------|----------------|
File                            |  % Stmts | % Branch |  % Funcs |  % Lines |Uncovered Lines |
--------------------------------|----------|----------|----------|----------|----------------|
 contracts/                     |    94.74 |    83.33 |       90 |    97.14 |                |
  MyERC20BidToken.sol           |      100 |      100 |      100 |      100 |                |
  MyERC721NFT.sol               |      100 |      100 |      100 |      100 |                |
  NFTDutchAuction_ERC20Bids.sol |    90.91 |       75 |       75 |    95.83 |             74 |
--------------------------------|----------|----------|----------|----------|----------------|
All files                       |    94.74 |    83.33 |       90 |    97.14 |                |
--------------------------------|----------|----------|----------|----------|----------------|

> Istanbul reports written to ./coverage/ and ./coverage.json