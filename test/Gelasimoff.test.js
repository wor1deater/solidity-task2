const { expect } = require("chai")
const { ethers } = require("hardhat")


describe("Gelasimoff_Collection", function () {
    let acc1, acc2, acc3, gelasimoff


    beforeEach(async function () {
        [acc1, acc2, acc3] = await ethers.getSigners()
        Gelasimoff = await ethers.getContractFactory("GelasimoffCollection", acc1)
        gelasimoff = await Gelasimoff.deploy(acc1)
        await gelasimoff.deployed
    })

    describe("Minting", function () {
        it("Should mint NFTs correctly", async function () {
            await gelasimoff.mint(3, acc1.address, { value: ethers.parseEther("0.003") });
            expect(await gelasimoff.balanceOf(acc1.address)).to.equal(3);
            expect(await gelasimoff.tokenId()).to.equal(3);
        });
    
        it("Should revert when trying to mint 0 or more than 3 NFT", async function() {
            await expect(
                gelasimoff.connect(acc2).mint(4, acc2)
            ).to.be.rejectedWith("You can't mint more than 3 NFTs");
    
            await expect(
                gelasimoff.connect(acc2).mint(0, acc2)
            ).to.be.rejectedWith("NFTs count can't be 0");
        })
    
        it("Should revert if trying to mint with insufficient ETH", async function () {
            await expect(gelasimoff.mint(3, acc1.address, { value: ethers.parseEther("0.002") })).to.be.revertedWith("Incorrect ETH value sent");
        });
    
        it("Should revert if trying to mint to zero address", async function () {
            await expect(gelasimoff.mint(1, ethers.ZeroAddress, { value: ethers.parseEther("0.001") })).to.be.revertedWith("Invalid address");
        });
    
        it("Should revert if trying to mint more then 6 NFTs per address", async function () {
            await gelasimoff.mint(3, acc1.address, { value: ethers.parseEther("0.003") })
            await gelasimoff.mint(3, acc1.address, { value: ethers.parseEther("0.003") })
            await expect(gelasimoff.mint(1, acc1.address, { value: ethers.parseEther("0.001") })).to.be.revertedWith("You can't own more than 6 NFTs");
        });
    })

    
    describe("Withdrawing", function () {
        it("Should withdraw funds correctly", async function () {
            await gelasimoff.mint(1, acc1.address, { value: ethers.parseEther("0.001") });
            const initialBalance = await ethers.provider.getBalance(acc2.address);
            await gelasimoff.withdraw(ethers.parseEther("0.001"), acc2.address);
            const finalBalance = await ethers.provider.getBalance(acc2.address);
            expect(finalBalance).to.be.above(initialBalance);
        });

        it("Should revert if withdrawing more than balance", async function () {
            await expect(gelasimoff.withdraw(ethers.parseEther("0.001"), acc1.address)).to.be.revertedWith("Insufficient balance in contract");
        });

        it("Should revert if withdrawing zero amount", async function () {
            await expect(gelasimoff.withdraw(0, acc1.address)).to.be.revertedWith("Withdrawal amount cannot be 0");
        });

        it("Should revert if withdrawing to zero address", async function () {
            await gelasimoff.mint(2, acc1.address, { value: ethers.parseEther("0.002") })
            await expect(gelasimoff.withdraw(ethers.parseEther("0.001"), ethers.ZeroAddress)).to.be.revertedWith("Invalid address");
        });
    }) 

    describe("Token URI", function () {
        it("Should return correct token URI", async function () {
            await gelasimoff.mint(1, acc1.address, { value: ethers.parseEther("0.001") });
            const tokenId = 1;
            const expectedURI = "https://magenta-accessible-fly-300.mypinata.cloud/ipfs/QmcbqsqXBFaA32eFwVzjNqdEgkH8bCtjBcHdU3Uy4dEbTC/1.json";
            expect(await gelasimoff.tokenURI(tokenId)).to.equal(expectedURI);
        });

        it("Should revert for non-existent token", async function () {
            await expect(gelasimoff.tokenURI(10)).to.be.revertedWith("Token not exist");
        });
    });

})
