// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./afjp_token.sol";

contract AntiWhale {
    uint256 constant ONE_WEEK = 7 * 24 * 60 * 60; // seconds

    struct AntiWhaleInfo {
        uint256 lastRetireTime;
    }

    mapping(address => AntiWhaleInfo) public antiWhaleInfos;

    function retireWithFee(uint256 amount) public {
        uint256 now = block.timestamp;
        // Ensure AntiWhaleInfo exists
        if (antiWhaleInfos[msg.sender].lastRetireTime == 0) {
            antiWhaleInfos[msg.sender] = AntiWhaleInfo(0);
        }
        require(now >= antiWhaleInfos[msg.sender].lastRetireTime + ONE_WEEK, "Only once per week");

        uint256 totalSupply = AFJPToken(address(this)).getTotalSupply();
        // Calculate fee = (amount / total_supply) * amount (percentage burn)
        uint256 fee = (amount * amount) / totalSupply;
        uint256 amountAfterFee = amount - fee;

        // Burn the fee
        AFJPToken(address(this)).burn(msg.sender, fee);
        // Burn the rest as retiring tokens

        antiWhaleInfos[msg.sender].lastRetireTime = now;
    }
}