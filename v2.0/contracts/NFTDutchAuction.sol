// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;
interface ERC721Tokens {
    function supportsInterface(bytes4 interfaceId) external view returns (bool);
    function safeTransferFrom(address from, address to, uint256 tokenId) external;
}



contract NFTDutchAuction {

    ERC721Tokens public token;
    uint256 public nftTokenId;
    address payable public seller;
    address public buyer = address(0x0);

    uint256 immutable reservePrice;
    uint256 numBlockAuctionOpen;
    uint256 immutable offerPriceDecrement;
    uint256 immutable initialPrice;
    uint256 immutable initialBlock;
    uint256 endBlock;
    address public highestBidder;
    bool auctionEnd = false;

    constructor(
        address erc721TokenAddress,
        uint256 _nftTokenId,
        uint256 _reservePrice,
        uint256 _numBlocksAuctionOpen,
        uint256 _offerPriceDecrement
    )  {
        ERC721Tokens erc165 = ERC721Tokens(erc721TokenAddress);
        require(erc165.supportsInterface(0x80ac58cd), "Not an ERC721 contract");
        token = ERC721Tokens(erc721TokenAddress);
        nftTokenId = _nftTokenId;
        reservePrice = _reservePrice;
        numBlockAuctionOpen = _numBlocksAuctionOpen;
        offerPriceDecrement = _offerPriceDecrement;
        seller = payable(msg.sender);
        initialPrice = _reservePrice + (_numBlocksAuctionOpen * _offerPriceDecrement);
        initialBlock = block.number;
        endBlock = block.number + numBlockAuctionOpen;
    }

    function currentPrice() public view returns(uint256){
        return initialPrice - ((block.number - initialBlock) * offerPriceDecrement);
    }

    function bid() public payable {
        require(!auctionEnd, "Auction closed");
        require(buyer == address(0x0), "Auction Concluded");
        require(msg.sender != seller, "Sellers are not allowed to buy");
        require(block.number < endBlock, "Auction Closed");
        uint256 curPrice = currentPrice();
        require(msg.value >= curPrice, "Bid value must be greater than or equal to the current price");

        highestBidder = msg.sender;
        token.safeTransferFrom(address(seller), highestBidder, nftTokenId);
        seller.transfer(msg.value);

        auctionEnd = true;
    }
}
