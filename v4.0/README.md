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

> MyERC20BidToken.sol
> MyERC721NFT.sol
> NFTDutchAuction_ERC20Bids.sol

Compilation:
============

Nothing to compile
No need to generate any newer typings.

Network Info
============
> HardhatEVM: v2.11.1
> network:    hardhat



  Test Cases
    Mint
      ✔ ERC20 Tests - Cap Assertion (502ms)

  ERC20 and ERC721 Tests
    ✔ ERC20 minting by Owner (40ms)
    ✔ ERC20 minting by Other Account
    ✔ ERC20 - Cap exceeded (56ms)
    ✔ ERC 721 - should revert when maximum token supply is reached (182ms)
    Auction Tests
      ✔ ERC721 - Safe Mint by Owner
      ✔ ERC721 - Safe Mint by Other Account
      ✔ Deploy Dutch Auction Contract (360ms)

  Bids
    ✔ Pre ERC20 Approval (39ms)
    ✔ ERC20 Approved (46ms)

  After approval
    ✔ should revert when the seller is trying to bid (67ms)
    ✔ should revert when the token is not approved (112ms)
    ✔ should revert when the token id doesn't exist while approving
    ✔ should revert when the approve caller is not the token owner
    ✔ Approved

  Bid After Approval
    ✔ should rever when the bid placed is less than current price
    ✔ Successful Bid
    ✔ should revert when a bid is placed after auction is closed

  Transfer to seller
    ✔ should transfer tokens from highestBidder to seller on successful bid


  19 passing (2s)

--------------------------------|----------|----------|----------|----------|----------------|
File                            |  % Stmts | % Branch |  % Funcs |  % Lines |Uncovered Lines |
--------------------------------|----------|----------|----------|----------|----------------|
 contracts\                     |      100 |    77.78 |    88.89 |      100 |                |
  MyERC20BidToken.sol           |      100 |      100 |      100 |      100 |                |
  MyERC721NFT.sol               |      100 |      100 |      100 |      100 |                |
  NFTDutchAuction_ERC20Bids.sol |      100 |    71.43 |       75 |      100 |                |
--------------------------------|----------|----------|----------|----------|----------------|
All files                       |      100 |    77.78 |    88.89 |      100 |                |
--------------------------------|----------|----------|----------|----------|----------------|

> Istanbul reports written to ./coverage/ and ./coverage.json