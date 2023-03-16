import { time, loadFixture, mine} from "@nomicfoundation/hardhat-network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers, upgrades } from "hardhat";
import { BigNumber, Signer, BigNumberish, constants, Signature, Wallet } from 'ethers'
import { splitSignature } from 'ethers/lib/utils'
import { MyERC20BidToken } from "../typechain-types";
import { erc20 } from "../typechain-types/@openzeppelin/contracts/token";


async function getPermitSignature(signer:any, token:MyERC20BidToken, spender:string, value:any, deadline:BigNumber) {
    const [nonce, name, version, chainId] = await Promise.all([
        token.nonces(signer.address),
        token.name(),
        "1",
        signer.getChainId(),
    ])
    return ethers.utils.splitSignature(
      await signer._signTypedData(
          {
              name,
              version,
              chainId,
              verifyingContract: token.address,
          },
          {
              Permit: [
                  {
                      name: "owner",
                      type: "address",
                  },
                  {
                      name: "spender",
                      type: "address",
                  },
                  {
                      name: "value",
                      type: "uint256",
                  },
                  {
                      name: "nonce",
                      type: "uint256",
                  },
                  {
                      name: "deadline",
                      type: "uint256",
                  },
              ],
          },
        {
          owner: signer.address,
          spender,
          value,
          nonce,
          deadline,
        }
      )
    )
}


describe("Test Cases", function () {
  async function deployOneYearLockFixture() {
    
    const [owner, otherAccount, account3] = await ethers.getSigners();

    const ERC20MintingFactory = await ethers.getContractFactory("MyERC20BidToken");
    const MintERC20Token = await ERC20MintingFactory.deploy(10000);
    
    const mintingFactory = await ethers.getContractFactory("MyERC721Token");
    const mintingToken = await mintingFactory.deploy(5);

    return { MintERC20Token, mintingToken, owner, otherAccount };
  }

  describe("Mint", function () {
    it("ERC20 Tests - Cap Assertion", async function(){
        const {MintERC20Token, owner, otherAccount} = await loadFixture(deployOneYearLockFixture);
        // const maxSupply = await MintERC20Token.getMaxSupply();
        

        describe("ERC20 and ERC721 Tests", function(){
            it("ERC20 minting by Owner", async function () {
                expect(await MintERC20Token.mint(owner.address, 2000));
              });
            
            it("ERC20 minting by Other Account", async function () {
            expect(await MintERC20Token.mint(otherAccount.address, 2000));
            });

            it("ERC20 - Cap exceeded", async function () {
                const maxSupply = await MintERC20Token.getMaxSupply();
                await MintERC20Token.mint(owner.address, maxSupply);
                await expect(MintERC20Token.mint(otherAccount.address, 100)).to.be.revertedWith('Maximum supply reached!');
                
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
                    const { MintERC20Token ,mintingToken, owner, otherAccount } = await loadFixture(deployOneYearLockFixture);
                    expect(mintingToken.safeMint(owner.address));
                    
                    const nftDutchAuctionFactory = await ethers.getContractFactory("NFTDutchAuction_ERC20Bids");
                    const nftDutchAuctionToken = await upgrades.deployProxy(
                      nftDutchAuctionFactory,
                        [MintERC20Token.address, mintingToken.address, 1, 100, 30, 10],
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
                        it("ERC20 Permit: Invalid Signature Rejection", async function(){
                          const amount = 1000;
                          const deadline = constants.MaxUint256;
                          const {v, r, s} = await getPermitSignature(
                              owner,
                              MintERC20Token,
                              nftDutchAuctionToken.address,
                              amount,
                              deadline
                          )
                          await expect(MintERC20Token.permit(owner.address, nftDutchAuctionToken.address, 200, deadline, v, r, s)).to.be.revertedWith("ERC20Permit: invalid signature");
                      });
                      it("ERC20 Permit: Wokring", async function(){
                        const amount = 1000;
                        const deadline = constants.MaxUint256;
                        const {v, r, s} = await getPermitSignature(
                            owner,
                            MintERC20Token,
                            nftDutchAuctionToken.address,
                            amount,
                            deadline
                        )
                        await MintERC20Token.permit(owner.address, nftDutchAuctionToken.address, amount, deadline, v, r, s);
                            
                            describe("After approval", function(){
                                
                                it("should revert when the seller is trying to bid", async function(){
                                    MintERC20Token.mint(otherAccount.address, 2000);
                                    await expect(nftDutchAuctionToken.connect(owner).bid(2000)).to.be.revertedWith('Sellers are not allowed to buy');
                                })

                                it("should revert when the token is not approved", async function(){
                                    MintERC20Token.mint(otherAccount.address, 2000);
                                    MintERC20Token.connect(otherAccount).approve(nftDutchAuctionToken.address, 2000)
                                   
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

                                        it("should revert when a bid is placed after auction is closed", async function () {
                                          await mine(30);
                                          await expect(nftDutchAuctionToken.connect(otherAccount).bid(2000)).to.be.revertedWith("Auction already closed");
                                        });
                    
                                        it("Successful Bid", async function () {
                                            await expect(nftDutchAuctionToken.connect(otherAccount).bid(2000));
                                        
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