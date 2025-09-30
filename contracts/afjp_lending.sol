// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./afjp_token.sol";

contract Lending {
    struct Loan {
        uint256 loanId;
        address borrower;
        uint256 collateralAmount;
        uint256 borrowedAmount;
        uint256 interestRate;
        uint256 startTime;
        uint256 dueDate;
        bool isActive;
    }

    struct LendingPool {
        uint256 totalCollateral;
        uint256 totalBorrowed;
        uint256 availableLiquidity;
    }

    mapping(uint256 => Loan) public loans;
    uint256 public loanCounter;
    LendingPool public lendingPool;

    // Core functions
    function createLoan(
        uint256 collateralAmount,
        uint256 borrowAmount
    ) public returns (uint256) {
        loanCounter++;
        loans[loanCounter] = Loan(loanCounter, msg.sender, collateralAmount, borrowAmount, 5, block.timestamp, block.timestamp + 30 days, true);
        // Transfer collateral
        AFJPToken(address(this)).transferFrom(msg.sender, address(this), collateralAmount);
        // Mint borrowed amount
        AFJPToken(address(this)).mint(msg.sender, borrowAmount);
        lendingPool.totalCollateral += collateralAmount;
        lendingPool.totalBorrowed += borrowAmount;
        return loanCounter;
    }

    function repayLoan(uint256 loanId, uint256 amount) public {
        Loan storage loan = loans[loanId];
        require(loan.borrower == msg.sender, "Not borrower");
        AFJPToken(address(this)).burn(msg.sender, amount);
        loan.borrowedAmount -= amount;
        if (loan.borrowedAmount == 0) {
            loan.isActive = false;
            // Return collateral
            AFJPToken(address(this)).transfer(msg.sender, loan.collateralAmount);
        }
    }

    function liquidateCollateral(uint256 loanId) public {
        Loan storage loan = loans[loanId];
        require(block.timestamp > loan.dueDate, "Not due");
        // Liquidate logic
        AFJPToken(address(this)).transfer(msg.sender, loan.collateralAmount);
        loan.isActive = false;
    }

    function getLoanInfo(uint256 loanId) public view returns (address, uint256, uint256, uint256, uint256, uint256, bool) {
        Loan memory loan = loans[loanId];
        return (loan.borrower, loan.collateralAmount, loan.borrowedAmount, loan.interestRate, loan.startTime, loan.dueDate, loan.isActive);
    }
}