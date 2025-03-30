// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

interface IERC20 {
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
}

contract RewardPoolManager {
    address public tokenAddress;
    address public treasury;
    address public owner;

    struct Pool {
        string ipfsHash;
        uint256 entryCost;
        bool active;
    }

    mapping(uint256 => Pool) public pools;
    uint256 public poolCount;

    mapping(uint256 => address[]) public poolEntries;

    modifier onlyOwner(){
        require(msg.sender == owner, "Only (organization) have access");
        _;
    }

    constructor(address _tokenAddress, address _treasury) {
        tokenAddress = _tokenAddress; //This would be the address to which the token was transferred by the organization.
        treasury = _treasury; //
    }

    function createPool(string memory ipfsHash, uint256 entryCost) external onlyOwner{
        pools[poolCount] = Pool(ipfsHash, entryCost, true);
        poolCount++;
    }

    //The user can enter the pool.
    function enterPool(uint256 poolId) external {
        Pool memory pool = pools[poolId];
        require(pool.active, "Pool not active");

        // Transfer tokens from user to treasury (or burn address)
        IERC20(tokenAddress).transferFrom(msg.sender, treasury, pool.entryCost);

        // Log the user who redeemed
        poolEntries[poolId].push(msg.sender);
    }

    function getPoolEntries(uint256 poolId) external view returns (address[] memory) {
        return poolEntries[poolId];
    }
}
