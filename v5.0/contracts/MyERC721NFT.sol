// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract MyERC721Token is ERC721, Ownable {
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIdCounter;
    
    uint256 maxSupply;

    constructor(uint256 _maxSupply) ERC721("MyERC721Token", "MTK") {
        maxSupply = _maxSupply;
    }

    function getMaxSupply() public view returns(uint256){
        return maxSupply;
    }

    function safeMint(address to) public onlyOwner {
        uint256 tokenId = _tokenIdCounter.current() + 1;
        require(tokenId <= (maxSupply), "Maximum Token Supply Reached Already!!!");
        _tokenIdCounter.increment();
        _safeMint(to, tokenId);
    }
}