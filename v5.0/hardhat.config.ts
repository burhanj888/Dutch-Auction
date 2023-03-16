import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
require('@openzeppelin/hardhat-upgrades');
import '@nomiclabs/hardhat-ethers'
import '@typechain/hardhat'


const config: HardhatUserConfig = {
  solidity: "0.8.17",
};

export default config;
