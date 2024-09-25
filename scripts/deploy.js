async function main() {
    const [deployer] = await ethers.getSigners();
    console.log("Deploying contracts with the account:", deployer.address);
  
    const Gelasimoff = await ethers.getContractFactory("GelasimoffCollection");
    const gelasimoff = Gelasimoff.deploy(deployer.address);
    await gelasimoff.deployed;
    console.log("Contract deployed to:", gelasimoff.address);
  }
  
  main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });