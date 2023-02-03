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


Version
=======
> solidity-coverage: v0.8.0

Instrumenting for coverage...
=============================

> BasicDutchAuction.sol

Compilation:
============

Generating typings for: 1 artifacts in dir: typechain-types for target: ethers-v5
Successfully generated 6 typings!
Compiled 1 Solidity file successfully

Network Info
============
> HardhatEVM: v2.11.1
> network:    hardhat



  BasicDutchAuction
    Deployment
      ✔ Get the initial price (2065ms)
      ✔ Bid from the account which created the contract
      ✔ Bid from buyer account - Equal to the current price
      ✔ Bid from buyer account - Greater than the current price
      ✔ Bid from buyer account - Less than the price
    Auction Conclusion
      ✔ Auction Concluded - bid from another buyer
      ✔ Auction Closed
      ✔ Auction Closed
      ✔ Bid from buyer account - After the auction is closed
      ✔ Bid from buyer account - After the auction has been concluded
      ✔ Auction Concluded - Bid from buyer after auction is concluded
      ✔ Auction Closed - Bid from buyer after auction is closed


  12 passing (639ms)

------------------------|----------|----------|----------|----------|----------------|
File                    |  % Stmts | % Branch |  % Funcs |  % Lines |Uncovered Lines |
------------------------|----------|----------|----------|----------|----------------|
 contracts\             |     9.09 |        0 |    66.67 |    42.11 |                |
  BasicDutchAuction.sol |     9.09 |        0 |    66.67 |    42.11 |... 43,44,47,49 |
------------------------|----------|----------|----------|----------|----------------|
All files               |     9.09 |        0 |    66.67 |    42.11 |                |
------------------------|----------|----------|----------|----------|----------------|

> Istanbul reports written to ./coverage/ and ./coverage.json
