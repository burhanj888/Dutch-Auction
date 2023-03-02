import { time, loadFixture, mine} from "@nomicfoundation/hardhat-network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers, upgrades } from "hardhat";

describe("Test Cases", function () {
  async function deployOneYearLockFixture() {
    
    const [owner, otherAccount, account3] = await ethers.getSigners();

    const mintingFactoryForERC20 = await ethers.getContractFactory("MyERC20BidToken");
    const mintingTokenForERC20 = await mintingFactoryForERC20.deploy(10000);
    
    const mintingFactory = await ethers.getContractFactory("MyERC721Token");
    const mintingToken = await mintingFactory.deploy(5);

    return { mintingTokenForERC20, mintingToken, owner, otherAccount };
  }

  describe("Mint", function () {
    it("ERC20 Tests - Cap Assertion", async function(){
        const {mintingTokenForERC20, owner, otherAccount} = await loadFixture(deployOneYearLockFixture);
        const maxSupply = await mintingTokenForERC20.cap();
        

        describe("ERC20 and ERC721 Tests", function(){
            it("ERC20 minting by Owner", async function () {
                expect(await mintingTokenForERC20.mint(owner.address, 2000));
              });
            
            it("ERC20 minting by Other Account", async function () {
            expect(await mintingTokenForERC20.mint(otherAccount.address, 2000));
            });

            it("ERC20 - Cap exceeded", async function () {
                await expect(mintingTokenForERC20.mint(otherAccount.address, 10005)).to.be.revertedWith('ERC20Capped: cap exceeded');
                
            });

            it("ERC 721 - should revert when maximum token supply is reached", async function () {
              const { mintingToken, owner } = await loadFixture(deployOneYearLockFixture);
              const maxSupply = await mintingToken.getMaxSupply();
              for (let i = 0; i < maxSupply; i++) {
                await mintingToken.safeMint(owner.address);
              }
              await expect(mintingToken.safeMint(owner.address)).to.be.revertedWith("Maximum Token Supply Reached Already!!!");
            });

            describe("Auction Tests", function(){
                it("ERC721 - Safe Mint by Owner", async function () {
                    const { mintingToken, owner } = await loadFixture(deployOneYearLockFixture);
                    expect(await mintingToken.safeMint(owner.address));
                });
              
                it("ERC721 - Safe Mint by Other Account", async function () {
                    const { mintingToken, otherAccount } = await loadFixture(deployOneYearLockFixture);
                    await expect(mintingToken.connect(otherAccount).safeMint(otherAccount.address)).eventually.to.rejectedWith(Error, "VM Exception while processing transaction: reverted with reason string 'Ownable: caller is not the owner");
                }); 
                
                it("Deploy Dutch Auction Contract", async function () {
                    const { mintingTokenForERC20 ,mintingToken, owner, otherAccount } = await loadFixture(deployOneYearLockFixture);
                    expect(mintingToken.safeMint(owner.address));
                    
                    const nftDutchAuctionFactory = await ethers.getContractFactory("NFTDutchAuction_ERC20Bids");
                    const nftDutchAuctionToken = await upgrades.deployProxy(
                      nftDutchAuctionFactory,
                        [mintingTokenForERC20.address, mintingToken.address, 1, 100, 30, 10],
                        {
                            kind: "uups",
                            initializer: "initialize(address, address, uint256, uint256, uint256, uint256)",
                            timeout: 0
                        },
                    );
    await nftDutchAuctionToken.deployed();
                    
                    expect(await nftDutchAuctionToken.seller()).to.equal(owner.address);  

                    describe("Bids", function(){
                    
                        it("Pre ERC20 Approval", async function(){
                            await expect(nftDutchAuctionToken.connect(otherAccount).bid(2000)).to.be.revertedWith('Bidder has not approved enough tokens'); 
                        })
                        it("ERC20 Approved", async function(){
                            await mintingTokenForERC20.connect(otherAccount).approve(nftDutchAuctionToken.address, 2000);
                            
                            describe("After approval", function(){
                                
                                it("should revert when the seller is trying to bid", async function(){
                                    mintingTokenForERC20.mint(otherAccount.address, 2000);
                                    await expect(nftDutchAuctionToken.connect(owner).bid(2000)).to.be.revertedWith('Sellers are not allowed to buy');
                                })

                                it("should revert when the token is not approved", async function(){
                                    mintingTokenForERC20.mint(otherAccount.address, 2000);
                                    mintingTokenForERC20.connect(otherAccount).approve(nftDutchAuctionToken.address, 2000)
                                   
                                    await expect(nftDutchAuctionToken.connect(otherAccount).bid(2000)).to.be.revertedWith('ERC721: caller is not token owner or approved');
                                })

                                it("should revert when the token id doesn't exist while approving", async function(){
                                    await expect(mintingToken.approve(nftDutchAuctionToken.address, 9)).to.be.revertedWith('ERC721: invalid token ID');
                                });
                    
                                it("should revert when the approve caller is not the token owner", async function () {
                                    await expect(mintingToken.connect(otherAccount).approve(nftDutchAuctionToken.address,1)).to.be.revertedWith('ERC721: approve caller is not token owner or approved for all');
                                });
                                it("Approved", async function () {
                                    
                                    expect(await mintingToken.approve(nftDutchAuctionToken.address,1));
                                    describe("Bid After Approval", function () {
                                        it("should rever when the bid placed is less than current price", async function () {
                                            await expect(nftDutchAuctionToken.connect(otherAccount).bid(200)).to.be.revertedWith('Bid value must be greater than or equal to the current price');
                                        });
                    
                                        it("Successful Bid", async function () {
                                            await expect(nftDutchAuctionToken.connect(otherAccount).bid(2000));
                                            
                                            describe("Transfer to seller", function(){
                                              it("should transfer tokens from highestBidder to seller on successful bid", async function() {
                                            
                                                expect(await mintingTokenForERC20.balanceOf(owner.address)).to.equal(2000);
                                              });
                                            })
                                        });

                                        it("should revert when a bid is placed after auction is closed", async function () {
                                          await mine(30);
                                          await expect(nftDutchAuctionToken.connect(otherAccount).bid(2000 )).to.be.revertedWith("Auction already closed");
                                        });


                                    });
                                    
                                });


                            })
                        });
                        
                       
                    })
            })

        })
    });
  });
});
});