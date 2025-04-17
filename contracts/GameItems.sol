// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract GameItems is ERC721Enumerable, Ownable {
    using Strings for uint256;

    uint256 private _nextTokenId = 1;
    string private _baseTokenURI;

    // Item properties stored on-chain
    mapping(uint256 => ItemAttributes) public itemAttributes;

    struct ItemAttributes {
        uint8 itemType; // 0=weapon, 1=armor, 2=potion, etc.
        uint8 rarity; // 0=common, 1=uncommon, 2=rare, 3=epic, 4=legendary
        uint16 power; // Item power or effect strength
        uint32 created; // Timestamp when item was created
    }

    event ItemCreated(
        uint256 indexed tokenId,
        address indexed owner,
        ItemAttributes attributes
    );

    // Updated constructor to support OpenZeppelin's Ownable v5+
    constructor(
        address initialOwner
    ) ERC721("CryptoQuest Items", "CQITEM") Ownable(initialOwner) {}

    function mintItem(
        address player,
        uint8 itemType,
        uint8 rarity,
        uint16 power
    ) public onlyOwner returns (uint256) {
        uint256 tokenId = _nextTokenId++;
        _mint(player, tokenId);

        ItemAttributes memory attributes = ItemAttributes({
            itemType: itemType,
            rarity: rarity,
            power: power,
            created: uint32(block.timestamp)
        });

        itemAttributes[tokenId] = attributes;

        emit ItemCreated(tokenId, player, attributes);

        return tokenId;
    }

    function setBaseURI(string memory baseURI) public onlyOwner {
        _baseTokenURI = baseURI;
    }

    function _baseURI() internal view override returns (string memory) {
        return _baseTokenURI;
    }
}
