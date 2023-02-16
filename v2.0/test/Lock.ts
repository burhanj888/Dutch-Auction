import { time, loadFixture, mine } from "@nomicfoundation/hardhat-network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("Tests", function () {
  async function deployOneYearLockFixture() {
    
    const [owner, otherAccount] = await ethers.getSigners();

    const mintERC721TokenFactory = await ethers.getContractFactory("MyERC721Token");
    const mintERC721Token = await mintERC721TokenFactory.deploy(5);

    return { mintERC721Token, owner, otherAccount };
  }

  describe("Mint ERC721 Token", function () {
    it("safMint successfully by the owner", async function () {
      const { mintERC721Token, owner } = await loadFixture(deployOneYearLockFixture);
      expect(await mintERC721Token.safeMint(owner.address));
    });

    it("should revert when non-owner tries to safely mint a token", async function () {
      const { mintERC721Token, otherAccount } = await loadFixture(deployOneYearLockFixture);
      await expect(mintERC721Token.connect(otherAccount).safeMint(otherAccount.address)).to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("should revert when maximum token supply is reached", async function () {
      const { mintERC721Token, owner } = await loadFixture(deployOneYearLockFixture);
      const maxSupply = await mintERC721Token.getMaxSupply();
      for (let i = 0; i < maxSupply; i++) {
        await mintERC721Token.safeMint(owner.address);
      }
      await expect(mintERC721Token.safeMint(owner.address)).to.be.revertedWith("Maximum Token Supply Reached Already!!!");
    });

    it("Mint Successfully and Deploy Auction's Contract", async function () {
        const { mintERC721Token, owner, otherAccount } = await loadFixture(deployOneYearLockFixture);
        expect(mintERC721Token.safeMint(owner.address));
        
        const nftDutchAuctionFactory = await ethers.getContractFactory("NFTDutchAuction");
        const nftDutchAuctionToken = await nftDutchAuctionFactory.deploy(mintERC721Token.address, 1, 1000, 10, 100);
        

        

        expect(await nftDutchAuctionToken.seller()).to.equal(owner.address);
        
        describe("Without Approval", function () {
            it("should revert when the seller tries to bid without approval", async function () {
                await expect(nftDutchAuctionToken.connect(owner).bid({value:2000})).to.be.revertedWith('Sellers are not allowed to buy');
            });

            it("should revert when the other account tries to bid without approval", async function () {
                await expect(nftDutchAuctionToken.connect(otherAccount).bid({value:2000})).to.be.revertedWith('ERC721: caller is not token owner or approved');
            });

            it("should revert when the seller tries to approve with invalid TokenID", async function(){
                await expect(mintERC721Token.approve(nftDutchAuctionToken.address, 9)).to.be.revertedWith('ERC721: invalid token ID');
            });

            it("should revert when the other account try to approve", async function () {
                await expect(mintERC721Token.connect(otherAccount).approve(nftDutchAuctionToken.address,1)).to.be.revertedWith('ERC721: approve caller is not token owner or approved for all');
            });
            it("After Approval", async function () {
                const approvalResult = await mintERC721Token.approve(nftDutchAuctionToken.address, 1);
                expect(await mintERC721Token.approve(nftDutchAuctionToken.address,1));
                describe("Bid - With Approval", function () {
                    it("should revert when a bid is placed with Insufficient Funds", async function () {
                        await expect(nftDutchAuctionToken.connect(otherAccount).bid({from: otherAccount.address, value: 100 })).to.be.revertedWith('Bid value must be greater than or equal to the current price');;
                    });

                    // it("Bid - Failure - Less than reserve price", async function () {
                    //     await expect(nftDutchAuctionToken.connect(otherAccount.address).bid({from: otherAccount.address, value: 1 })).to.be.revertedWith('Place a bid greater than reserve price');;
                    // });

                    it("Bid placed successfully by other", async function () {
                        await expect(nftDutchAuctionToken.connect(otherAccount.address).bid({from: otherAccount.address, value: 2000 }));
                    });

                    it("should revert when a bid is placed after auction is closed", async function () {
                      // const { nftDutchAuctionToken, seller, buyer } = await loadFixture(deployNFTDutchAuctionFixture);
                      await mine(11);
                      await expect(nftDutchAuctionToken.connect(otherAccount).bid({from: otherAccount.address,value: 2000 })).to.be.revertedWith("Auction Closed");
                    });
                });
                
            });
        });
        
      });

  });
});