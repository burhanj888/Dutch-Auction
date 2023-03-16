// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/draft-ERC20Permit.sol";

contract MyERC20BidToken is ERC20, Ownable, ERC20Permit {
    uint256 immutable maxSupply;
    uint256 currentSupply;

    constructor(uint256 _maxSupply)ERC20("MyBidToken", "MBT") ERC20Permit("MyBidToken"){
        maxSupply = _maxSupply;
    }

    function getMaxSupply() public view returns(uint256){
        return maxSupply;
    }

    function mint(address to, uint256 amount) public {
        currentSupply = totalSupply();
        require(currentSupply < maxSupply, "Maximum supply reached!");
        _mint(to, amount);
    }

    
}