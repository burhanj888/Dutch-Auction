import { time, loadFixture, mine} from "@nomicfoundation/hardhat-network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("Tests", function () {
  async function deployOneYearLockFixture() {
    
    const [owner, otherAccount, account3] = await ethers.getSigners();

    const mintingFactoryForERC20 = await ethers.getContractFactory("MyERC20BidToken");
    const mintingTokenForERC20 = await mintingFactoryForERC20.deploy(10000);
    
    const mintingFactory = await ethers.getContractFactory("MyERC721Token");
    const mintingToken = await mintingFactory.deploy(5);

    return { mintingTokenForERC20, mintingToken, owner, otherAccount };
  }

  describe("Mint", function () {
    it("ERC20 Tests - Max Supply Assertion", async function(){
        const {mintingTokenForERC20, owner, otherAccount} = await loadFixture(deployOneYearLockFixture);
        const maxSupply = await mintingTokenForERC20.cap();
        // console.log(maxSupply);
        // expect(await mintingTokenForERC20.getMaxSupply()).to.equal(500);

        describe("ERC20 and ERC721 Tests", function(){
            it("ERC20 by Owner", async function () {
                expect(await mintingTokenForERC20.mint(owner.address, 2000));

                // const balanceOf = await mintingTokenForERC20.balanceOf(owner.address);
                // console.log(balanceOf);
              });
            
            it("ERC20 by Other Account", async function () {
            expect(await mintingTokenForERC20.mint(otherAccount.address, 2000));

            // const balanceOf = await mintingTokenForERC20.balanceOf(otherAccount.address);
            // console.log(balanceOf);
            });

            it("ERC20 - Max Supply exceeded", async function () {
                await expect(mintingTokenForERC20.mint(otherAccount.address, 10005)).to.be.revertedWith('ERC20Capped: cap exceeded');
                // const circulatingSupply = await mintingTokenForERC20.totalSupply();
                // console.log(circulatingSupply);
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
                it("ERC721 - Safe Mint - Owner", async function () {
                    const { mintingToken, owner } = await loadFixture(deployOneYearLockFixture);
                    expect(await mintingToken.safeMint(owner.address));
                });
              
                it("ERC721 - Safe Mint - Other Account", async function () {
                    const { mintingToken, otherAccount } = await loadFixture(deployOneYearLockFixture);
                    await expect(mintingToken.connect(otherAccount).safeMint(otherAccount.address)).eventually.to.rejectedWith(Error, "VM Exception while processing transaction: reverted with reason string 'Ownable: caller is not the owner");
                }); 
                
                it("Deploy Auction's Contract", async function () {
                    const { mintingTokenForERC20 ,mintingToken, owner, otherAccount } = await loadFixture(deployOneYearLockFixture);
                    expect(mintingToken.safeMint(owner.address));
                    
                    const nftDutchAuctionFactory = await ethers.getContractFactory("NFTDutchAuction_ERC20Bids");
                    const nftDutchAuctionToken = await nftDutchAuctionFactory.deploy(mintingTokenForERC20.address, mintingToken.address, 1, 100, 30, 10);
                    
                    expect(await nftDutchAuctionToken.seller()).to.equal(owner.address);  

                    describe("Bids", function(){
                    
                        it("ERC20 Approval - Before", async function(){
                            await expect(nftDutchAuctionToken.connect(otherAccount).bid(2000)).to.be.revertedWith('Bidder has not approved enough tokens'); 
                        })
                        it("ERC20 Approval Process", async function(){
                            await mintingTokenForERC20.connect(otherAccount).approve(nftDutchAuctionToken.address, 2000);
                            
                            describe("Post Approval Process", function(){
                                
                                it("Bid before ERC721 approval - Seller trying to bid", async function(){
                                    mintingTokenForERC20.mint(otherAccount.address, 2000);
                                    // const otherAccountBal = await mintingTokenForERC20.balanceOf(otherAccount.address);
                                    // console.log(otherAccountBal)
                                    await expect(nftDutchAuctionToken.connect(owner).bid(2000)).to.be.revertedWith('Sellers are not allowed to buy');
                                })

                                it("Bid before ERC721 approval", async function(){
                                    mintingTokenForERC20.mint(otherAccount.address, 2000);
                                    mintingTokenForERC20.connect(otherAccount).approve(nftDutchAuctionToken.address, 2000)
                                    // const otherAccountBal = await mintingTokenForERC20.balanceOf(otherAccount.address);
                                    // console.log(otherAccountBal)
                                    // await expect(nftDutchAuctionToken.connect(otherAccount).bid({value:2000})).to.be.revertedWith('ERC721: caller is not token owner or approved');
                                    await expect(nftDutchAuctionToken.connect(otherAccount).bid(2000)).to.be.revertedWith('ERC721: caller is not token owner or approved');
                                })

                                it("Approving - Failure due to non-existent token id", async function(){
                                    await expect(mintingToken.approve(nftDutchAuctionToken.address, 9)).to.be.revertedWith('ERC721: invalid token ID');
                                });
                    
                                it("Approval - Failure - Not the owner", async function () {
                                    await expect(mintingToken.connect(otherAccount).approve(nftDutchAuctionToken.address,1)).to.be.revertedWith('ERC721: approve caller is not token owner or approved for all');
                                });
                                it("Approving", async function () {
                                    
                                    //const approvalResult = await mintingToken.approve(nftDutchAuctionToken.address, 0);
                                    expect(await mintingToken.approve(nftDutchAuctionToken.address,1));
                                    describe("Bid - After Approval", function () {
                                        it("Bid - Failure - Insufficient Funds", async function () {
                                            await expect(nftDutchAuctionToken.connect(otherAccount).bid(200)).to.be.revertedWith('Bid value must be greater than or equal to the current price');
                                        });
                    
                                        it("Bid - Success", async function () {
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

                                        // it("should close the auction after a successful bid", async function () {
                                        //   await nftDutchAuctionToken.connect(bidder).bid(initialPrice);
                                        //   const auctionEndStatus = await nftDutchAuctionToken.auctionEnd();
                                        //   expect(auctionEndStatus).to.equal(true);
                                        // });
                    
                                        

                                        // it("Bid - Failure - Closed Auction", async function () {
                                        //    await expect(nftDutchAuctionToken.connect(otherAccount).bid(410)).to.be.revertedWith('Auction is closed');;
                                        // });
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