// SPDX-License-Identifier:  IT
pragma solidity ^0.8.9;
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";

interface ERC721Tokens {
    function supportsInterface(bytes4 interfaceId) external view returns (bool);
    function safeTransferFrom(address from, address to, uint256 tokenId) external;
}



contract NFTDutchAuction_ERC20Bids is Initializable, OwnableUpgradeable, UUPSUpgradeable {


    IERC20 public bidToken;
    ERC721Tokens public token;
    uint256 public nftTokenId;
    address payable public seller;
    address public buyer;

    uint256 reservePrice;
    uint256 numBlockAuctionOpen;
    uint256 offerPriceDecrement;
    uint256 initialPrice;
    uint256 initialBlock;
    uint256 endBlock;
    address public highestBidder;
    bool auctionEnd;

    function initialize(address _erc20TokenAddress, 
    address _erc721TokenAddress, 
    uint256 _nftTokenId, 
    uint256 _reservePrice, 
    uint256 _numBlocksAuctionOpen, 
    uint256 _offerPriceDecrement) 
    initializer public {
        __Ownable_init();
        __UUPSUpgradeable_init();
    
        bidToken = IERC20(_erc20TokenAddress);
        token = ERC721Tokens(_erc721TokenAddress);
        nftTokenId = _nftTokenId;
        reservePrice = _reservePrice;
        numBlockAuctionOpen = _numBlocksAuctionOpen;
        offerPriceDecrement = _offerPriceDecrement;
        seller = payable(msg.sender);
        initialPrice = _reservePrice + (_numBlocksAuctionOpen * _offerPriceDecrement);
        initialBlock = block.number;
        endBlock = block.number + numBlockAuctionOpen;
        buyer = address(0x0);
        auctionEnd = false;
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
        bidToken.transferFrom(highestBidder, seller, amount);
        token.safeTransferFrom(seller, highestBidder, nftTokenId);
        
        return highestBidder;
    }

    function _authorizeUpgrade(address newImplementation)
        internal
        onlyOwner
        override
    {}
}  
