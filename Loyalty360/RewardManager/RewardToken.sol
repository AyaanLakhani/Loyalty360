//SPDX-License-Identifier: MIT 
pragma solidity ^0.8.10;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract RewardToken is ERC20, Ownable {
    uint256 public conversionRate = 10; // 1 dollar = 10 tokens

    // Mapping to track verified/enrolled users
    mapping(address => bool) public isEnrolled;

    event RewardRedeemed(address indexed to, uint256 points, uint256 tokens);
    event UserEnrolled(address indexed user);

    constructor() ERC20("RewardToken", "RWT") Ownable(msg.sender) {}

    // Organization verifies/enrolls the user into the reward program
    function enrollUser(address user) external onlyOwner {
        require(user != address(0), "Invalid user");
        isEnrolled[user] = true;
        emit UserEnrolled(user);
    }

    // Only owner (admin/backend) can mint tokens to enrolled users
    function redeemRewards(address to, uint256 rewardPoints) external onlyOwner {
        require(isEnrolled[to], "User not enrolled in reward program");

        uint256 amount = rewardPoints * conversionRate;
        _mint(to, amount);
        emit RewardRedeemed(to, rewardPoints, amount);
    }
}
