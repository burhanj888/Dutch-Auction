import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("Deployment", function () {
  async function deployOneYearLockFixture() {
    
    const [owner, otherAccount] = await ethers.getSigners();

    const basicDutchAuctionFactory = await ethers.getContractFactory("BasicDutchAuction");
    const basicDutchAuctionToken = await basicDutchAuctionFactory.connect(owner).deploy(100, 10, 10);

    return { basicDutchAuctionToken, owner, otherAccount };
  }

  describe("Deployment", function () {
    it("Get Current Price", async function () {
      const { basicDutchAuctionToken } = await loadFixture(deployOneYearLockFixture);

      expect(await basicDutchAuctionToken.currentPrice()).to.equal(200);
    });

    it("Bid placed by seller", async function () {
      const { basicDutchAuctionToken, owner } = await loadFixture(deployOneYearLockFixture);

      expect(basicDutchAuctionToken.connect(owner).bid({value:200})).to.be.revertedWith('Sellers are not allowed to buy');
    });

    it("Bid from another account - Equal to the price", async function () {
      const { basicDutchAuctionToken, owner, otherAccount } = await loadFixture(deployOneYearLockFixture);

      expect(basicDutchAuctionToken.connect(otherAccount).bid({from: otherAccount.address, value: 200 }));
      
    });

    it("Get seller address", async function () {
      const { basicDutchAuctionToken, owner, otherAccount } = await loadFixture(deployOneYearLockFixture);

      expect(await basicDutchAuctionToken.seller()).to.equal(owner.address);
      
    });

    it("Bid from another account - Less than the price", async function () {
      const { basicDutchAuctionToken, owner, otherAccount } = await loadFixture(deployOneYearLockFixture);

      expect(basicDutchAuctionToken.connect(otherAccount).bid({from: otherAccount.address, value: 20 })).to.be.revertedWith('Insufficient Funds');
    });

  });
});