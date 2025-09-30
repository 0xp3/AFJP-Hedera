// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Inheritance {
    struct Beneficiary {
        address primaryBeneficiary;
        address[] secondaryBeneficiaries;
        uint256[] distributionPercentages;
    }

    struct InheritanceRequest {
        address requester;
        address deceased;
        uint256 requestTime;
        uint8 status; // 0: pending, 1: approved, 2: rejected
    }

    mapping(address => Beneficiary) public beneficiaries;
    mapping(uint256 => InheritanceRequest) public inheritanceRequests;
    uint256 public requestCounter;

    // Core functions
    function designateBeneficiaries(
        address primary,
        address[] memory secondary,
        uint256[] memory percentages
    ) public {
        beneficiaries[msg.sender] = Beneficiary(primary, secondary, percentages);
    }

    function requestInheritance(address deceased) public returns (uint256) {
        requestCounter++;
        inheritanceRequests[requestCounter] = InheritanceRequest(msg.sender, deceased, block.timestamp, 0);
        return requestCounter;
    }

    function executeInheritance(uint256 requestId) public {
        InheritanceRequest storage request = inheritanceRequests[requestId];
        require(request.status == 1, "Request not approved");
        // Implement execution logic, e.g., transfer assets
    }

    function getBeneficiaries(address account) public view returns (address, address[] memory, uint256[] memory) {
        Beneficiary memory b = beneficiaries[account];
        return (b.primaryBeneficiary, b.secondaryBeneficiaries, b.distributionPercentages);
    }
}