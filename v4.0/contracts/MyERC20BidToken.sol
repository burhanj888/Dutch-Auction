// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Capped.sol";

contract MyERC20BidToken is ERC20Capped, Ownable {
    constructor(uint256 cap) ERC20("MyBidtToken", "MBT") ERC20Capped(cap){}

    function mint(address to, uint256 amount) public {
        _mint(to, amount);
    }
}