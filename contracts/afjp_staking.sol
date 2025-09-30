// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./afjp_token.sol";

contract Staking {
    struct StakingPool {
        uint256 totalStaked;
        uint256 totalRewards;
        uint256 rewardRate;
        uint256 lastUpdateTime;
    }

    struct StakerInfo {
        uint256 stakedAmount;
        uint256 rewardDebt;
        uint256 lastClaimTime;
    }

    StakingPool public stakingPool;
    mapping(address => StakerInfo) public stakers;

    // Core functions
    function stakeTokens(uint256 amount) public {
        AFJPToken(address(this)).transferFrom(msg.sender, address(this), amount);
        stakers[msg.sender].stakedAmount += amount;
        stakingPool.totalStaked += amount;
    }

    function unstakeTokens(uint256 amount) public {
        require(stakers[msg.sender].stakedAmount >= amount, "Insufficient staked");
        AFJPToken(address(this)).transfer(msg.sender, amount);
        stakers[msg.sender].stakedAmount -= amount;
        stakingPool.totalStaked -= amount;
    }

    function claimRewards() public {
        uint256 rewards = calculateRewards(msg.sender);
        AFJPToken(address(this)).mint(msg.sender, rewards);
        stakers[msg.sender].lastClaimTime = block.timestamp;
        stakers[msg.sender].rewardDebt += rewards;
    }

    function addRewards(uint256 amount) public {
        AFJPToken(address(this)).transferFrom(msg.sender, address(this), amount);
        stakingPool.totalRewards += amount;
    }

    function calculateRewards(address staker) public view returns (uint256) {
        StakerInfo memory info = stakers[staker];
        uint256 timeElapsed = block.timestamp - info.lastClaimTime;
        return (info.stakedAmount * stakingPool.rewardRate * timeElapsed) / 1e18; // assuming rate per second
    }
}