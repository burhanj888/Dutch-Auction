// SPDX-License-Identifier:  IT
pragma solidity ^0.8.9;
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

interface ERC721Tokens {
    function supportsInterface(bytes4 interfaceId) external view returns (bool);
    function safeTransferFrom(address from, address to, uint256 tokenId) external;
}



contract NFTDutchAuction_ERC20Bids {

    using SafeERC20 for IERC20;

    IERC20 public bidToken;
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
        address erc20TokenAddress,
        address erc721TokenAddress,
        uint256 _nftTokenId,
        uint256 _reservePrice,
        uint256 _numBlocksAuctionOpen,
        uint256 _offerPriceDecrement
    )  {
        ERC721Tokens erc165 = ERC721Tokens(erc721TokenAddress);
        bidToken = IERC20(erc20TokenAddress);
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

    function bid(uint256 amount) public payable returns(address){
        require(block.number < endBlock, "Auction already closed");
        require(msg.sender != seller, "Sellers are not allowed to buy");
        uint256 curPrice = currentPrice();
        require(amount >= curPrice, "Bid value must be greater than or equal to the current price");
        require(bidToken.allowance(msg.sender, address(this)) >= amount, "Bidder has not approved enough tokens");
        // require(bidToken.transferFrom(msg.sender, address(this), amount), "Token transfer failed");
        
        highestBidder = msg.sender;
        require(bidToken.transferFrom(highestBidder, seller, amount), "Token transfer to seller failed");
        token.safeTransferFrom(seller, highestBidder, nftTokenId);
        
        return highestBidder;

    }
}  
