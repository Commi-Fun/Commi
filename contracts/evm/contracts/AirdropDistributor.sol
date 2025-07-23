// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

/**
 * @title AirdropDistributor
 * @dev Contract for distributing airdrop tokens based on influence scores
 */
contract AirdropDistributor is Ownable, ReentrancyGuard, Pausable {
    using SafeERC20 for IERC20;
    
    IERC20 public immutable airdropToken;
    
    uint256 public minInfluenceScore = 100;
    uint256 public rewardAmount = 1000 * 10**18; // 1000 tokens
    uint256 public totalDistributed;
    uint256 public cooldownPeriod = 24 hours;
    
    mapping(address => bool) public authorized;
    mapping(string => bool) public processedTweets;
    mapping(string => UserReward) public userRewards;
    mapping(address => uint256) public lastRewardTime;
    
    struct UserReward {
        address userAddress;
        uint256 totalRewards;
        uint256 rewardCount;
        string[] rewardedTweets;
    }
    
    struct TweetReward {
        string userId;
        string tweetId;
        uint64 influenceScore;
        uint256 rewardAmount;
        uint256 timestamp;
    }
    
    event RewardDistributed(
        string indexed userId,
        string indexed tweetId,
        address indexed userAddress,
        uint64 influenceScore,
        uint256 rewardAmount,
        uint256 timestamp
    );
    
    event ConfigUpdated(
        uint256 minInfluenceScore,
        uint256 rewardAmount,
        uint256 cooldownPeriod
    );
    
    event AuthorizedAdded(address indexed authorized);
    event AuthorizedRemoved(address indexed authorized);
    
    modifier onlyAuthorized() {
        require(authorized[msg.sender] || msg.sender == owner(), "Not authorized");
        _;
    }
    
    constructor(address _airdropToken) {
        require(_airdropToken != address(0), "Invalid token address");
        airdropToken = IERC20(_airdropToken);
    }
    
    /**
     * @dev Distribute rewards to user based on tweet influence
     * @param userId Twitter user ID
     * @param tweetId Twitter tweet ID
     * @param userAddress User's wallet address
     * @param influenceScore Calculated influence score
     */
    function distributeReward(
        string calldata userId,
        string calldata tweetId,
        address userAddress,
        uint64 influenceScore
    ) external onlyAuthorized whenNotPaused nonReentrant {
        require(userAddress != address(0), "Invalid user address");
        require(influenceScore >= minInfluenceScore, "Insufficient influence score");
        require(!processedTweets[tweetId], "Tweet already processed");
        require(
            block.timestamp >= lastRewardTime[userAddress] + cooldownPeriod,
            "Cooldown period not elapsed"
        );
        
        // Check token balance
        require(
            airdropToken.balanceOf(address(this)) >= rewardAmount,
            "Insufficient token balance"
        );
        
        // Mark tweet as processed
        processedTweets[tweetId] = true;
        
        // Update user reward record
        UserReward storage reward = userRewards[userId];
        reward.userAddress = userAddress;
        reward.totalRewards += rewardAmount;
        reward.rewardCount++;
        reward.rewardedTweets.push(tweetId);
        
        // Update last reward time
        lastRewardTime[userAddress] = block.timestamp;
        
        // Transfer tokens
        airdropToken.safeTransfer(userAddress, rewardAmount);
        
        // Update total distributed
        totalDistributed += rewardAmount;
        
        emit RewardDistributed(
            userId,
            tweetId,
            userAddress,
            influenceScore,
            rewardAmount,
            block.timestamp
        );
    }
    
    /**
     * @dev Batch distribute rewards
     */
    function batchDistributeRewards(
        TweetReward[] calldata rewards
    ) external onlyAuthorized whenNotPaused nonReentrant {
        require(rewards.length > 0, "No rewards to distribute");
        
        uint256 totalRequired = rewards.length * rewardAmount;
        require(
            airdropToken.balanceOf(address(this)) >= totalRequired,
            "Insufficient token balance for batch"
        );
        
        for (uint256 i = 0; i < rewards.length; i++) {
            TweetReward memory reward = rewards[i];
            
            // Validate reward
            require(reward.influenceScore >= minInfluenceScore, "Insufficient influence score");
            require(!processedTweets[reward.tweetId], "Tweet already processed");
            
            // Process reward internally
            _processReward(reward);
        }
    }
    
    function _processReward(TweetReward memory reward) internal {
        // Mark tweet as processed
        processedTweets[reward.tweetId] = true;
        
        // Update user reward record
        UserReward storage userReward = userRewards[reward.userId];
        userReward.totalRewards += reward.rewardAmount;
        userReward.rewardCount++;
        userReward.rewardedTweets.push(reward.tweetId);
        
        // Transfer tokens (assuming userAddress is derived from userId)
        // In practice, you'd need a mapping from userId to address
        // airdropToken.safeTransfer(userAddress, reward.rewardAmount);
        
        totalDistributed += reward.rewardAmount;
        
        emit RewardDistributed(
            reward.userId,
            reward.tweetId,
            address(0), // Would need actual user address
            reward.influenceScore,
            reward.rewardAmount,
            reward.timestamp
        );
    }
    
    /**
     * @dev Update configuration parameters
     */
    function updateConfig(
        uint256 _minInfluenceScore,
        uint256 _rewardAmount,
        uint256 _cooldownPeriod
    ) external onlyOwner {
        minInfluenceScore = _minInfluenceScore;
        rewardAmount = _rewardAmount;
        cooldownPeriod = _cooldownPeriod;
        
        emit ConfigUpdated(_minInfluenceScore, _rewardAmount, _cooldownPeriod);
    }
    
    /**
     * @dev Add authorized address
     */
    function addAuthorized(address _authorized) external onlyOwner {
        require(_authorized != address(0), "Invalid address");
        authorized[_authorized] = true;
        emit AuthorizedAdded(_authorized);
    }
    
    /**
     * @dev Remove authorized address
     */
    function removeAuthorized(address _authorized) external onlyOwner {
        authorized[_authorized] = false;
        emit AuthorizedRemoved(_authorized);
    }
    
    /**
     * @dev Emergency withdraw tokens
     */
    function emergencyWithdraw(address to, uint256 amount) external onlyOwner {
        require(to != address(0), "Invalid address");
        airdropToken.safeTransfer(to, amount);
    }
    
    /**
     * @dev Pause the contract
     */
    function pause() external onlyOwner {
        _pause();
    }
    
    /**
     * @dev Unpause the contract
     */
    function unpause() external onlyOwner {
        _unpause();
    }
    
    /**
     * @dev Get user reward details
     */
    function getUserReward(string calldata userId) 
        external 
        view 
        returns (
            address userAddress,
            uint256 totalRewards,
            uint256 rewardCount,
            string[] memory rewardedTweets
        ) 
    {
        UserReward memory reward = userRewards[userId];
        return (
            reward.userAddress,
            reward.totalRewards,
            reward.rewardCount,
            reward.rewardedTweets
        );
    }
    
    /**
     * @dev Check if tweet has been processed
     */
    function isTweetProcessed(string calldata tweetId) external view returns (bool) {
        return processedTweets[tweetId];
    }
    
    /**
     * @dev Get contract token balance
     */
    function getTokenBalance() external view returns (uint256) {
        return airdropToken.balanceOf(address(this));
    }
}