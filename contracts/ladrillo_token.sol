// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./afjp_token.sol";

contract LadrilloToken {
    struct LadrilloNFT {
        uint256 propertyId;
        string propertyType;
        string location;
        uint256 totalFractions;
        uint256 rentalIncomePerFraction;
        address owner;
    }

    struct LadrilloFractionalToken {
        string name;
        string symbol;
        uint8 decimals;
        uint256 propertyId;
    }

    mapping(uint256 => LadrilloNFT) public ladrilloNFTs;
    mapping(uint256 => LadrilloFractionalToken) public fractionalTokens;
    mapping(address => mapping(uint256 => uint256)) public fractionsOwned; // owner => propertyId => fractions

    // Burn AFJP for Ladrillo fractions
    function burnAfjpForLadrillo(
        uint256 afjpAmount,
        uint256 propertyId,
        uint256 fractions
    ) public {
        // Assume burn AFJP
        // Create or update fractions
        if (ladrilloNFTs[propertyId].propertyId == 0) {
            ladrilloNFTs[propertyId] = LadrilloNFT(propertyId, "Type", "Location", 100, 10, msg.sender);
            fractionalTokens[propertyId] = LadrilloFractionalToken("Ladrillo", "LAD", 18, propertyId);
        }
        fractionsOwned[msg.sender][propertyId] += fractions;
    }

    // Claim rental income
    function claimRentalIncome(uint256 propertyId) public returns (uint256) {
        LadrilloNFT memory nft = ladrilloNFTs[propertyId];
        uint256 fractions = fractionsOwned[msg.sender][propertyId];
        uint256 income = fractions * nft.rentalIncomePerFraction;
        AFJPToken(address(this)).mint(msg.sender, income);
        return income;
    }
}