// SPDX-License-Identifier: MIT

pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract GelasimoffCollection is ERC721, Ownable {
    uint8  public tokenId;
    uint   public constant MINT_PRICE = 0.001 ether; 
    uint8  public constant TOTAL_SUPPLY = 100;
    uint8  public constant MAX_NFTS_PER_ACCOUNT = 6;
    uint8  public constant MAX_MINT = 3;
    string public constant BASE_URI = "https://magenta-accessible-fly-300.mypinata.cloud/ipfs/QmcbqsqXBFaA32eFwVzjNqdEgkH8bCtjBcHdU3Uy4dEbTC/";


    constructor(address onlyOwner) ERC721("GelasimoffCollection", "GLMF") Ownable(onlyOwner) {}


    function mint(uint amount, address to) public payable {
        require(amount <= MAX_MINT, "You can't mint more than 3 NFTs");
        require(amount != 0, "NFTs count can't be 0");
        require(to != address(0), "Invalid address");
        require(balanceOf(to) + amount <= MAX_NFTS_PER_ACCOUNT, "You can't own more than 6 NFTs");
        require(tokenId + amount <= TOTAL_SUPPLY, "Minting would exceed total supply of NFTs");
        require(msg.value == MINT_PRICE * amount, "Incorrect ETH value sent");

        for (uint8 i = 1; i <= amount; i++) {
            tokenId++;
            _safeMint(to, tokenId);
            tokenURI(tokenId);        
        }
    }

    function withdraw(uint256 amount, address payable to) public onlyOwner {
        require(amount <= address(this).balance, "Insufficient balance in contract");
        require(amount != 0, "Withdrawal amount cannot be 0");
        require(to != address(0), "Invalid address");

        to.transfer(amount);
    }

    function tokenURI(uint256 Id) public view override returns (string memory) {
        require(Id <= tokenId, "Token not exist");
        // Перегрузка метода tokenURI
        // Возвращаем полный URI метаданных токена
        
        return string(abi.encodePacked(BASE_URI, Strings.toString(Id), ".json"));
    }

}



// Contract address: https://sepolia.etherscan.io/address/0x84543fbe0170a80c4d70f047af693c85152d180f