// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;



contract BasicDutchAuction {

    address payable public seller;
    address public buyer = address(0x0);

    uint256 public immutable reservePrice;
    uint256 public immutable numBlockAuctionOpen;
    uint256 public immutable offerPriceDecrement;
    uint256 immutable initialPrice;
    uint256 immutable initialBlock;
    uint256 endBlock;
    address public highestBidder;
    bool auctionEnd = false;

    constructor(
        uint256 _reservePrice,
        uint256 _numBlocksAuctionOpen,
        uint256 _offerPriceDecrement
    )  {
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
        seller.transfer(msg.value);
        auctionEnd = true;
    }
}
