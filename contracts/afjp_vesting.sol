// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./afjp_token.sol";

contract Vesting {
    struct VestingSchedule {
        address beneficiary;
        uint256 totalAmount;
        uint256 releasedAmount;
        uint256 startTime;
        uint256 duration; // 5 years in seconds
        uint256 cliff;
    }

    struct VestingPool {
        uint256 totalVested;
        uint256 totalReleased;
    }

    mapping(address => VestingSchedule) public vestingSchedules;
    VestingPool public vestingPool;

    // Core functions
    function createVestingSchedule(
        address beneficiary,
        uint256 amount,
        uint256 duration,
        uint256 cliff
    ) public {
        AFJPToken(address(this)).transferFrom(msg.sender, address(this), amount);
        vestingSchedules[beneficiary] = VestingSchedule(beneficiary, amount, 0, block.timestamp, duration, cliff);
        vestingPool.totalVested += amount;
    }

    function releaseVestedTokens() public {
        VestingSchedule storage schedule = vestingSchedules[msg.sender];
        uint256 vested = calculateVestedAmount(msg.sender);
        uint256 releasable = vested - schedule.releasedAmount;
        require(releasable > 0, "No tokens to release");
        AFJPToken(address(this)).transfer(msg.sender, releasable);
        schedule.releasedAmount += releasable;
        vestingPool.totalReleased += releasable;
    }

    function getVestingInfo(address beneficiary) public view returns (uint256, uint256, uint256) {
        VestingSchedule memory schedule = vestingSchedules[beneficiary];
        return (schedule.totalAmount, schedule.releasedAmount, schedule.startTime);
    }

    function calculateVestedAmount(address beneficiary) public view returns (uint256) {
        VestingSchedule memory schedule = vestingSchedules[beneficiary];
        if (block.timestamp < schedule.startTime + schedule.cliff) {
            return 0;
        }
        if (block.timestamp >= schedule.startTime + schedule.duration) {
            return schedule.totalAmount;
        }
        uint256 elapsed = block.timestamp - schedule.startTime;
        return (schedule.totalAmount * elapsed) / schedule.duration;
    }
}