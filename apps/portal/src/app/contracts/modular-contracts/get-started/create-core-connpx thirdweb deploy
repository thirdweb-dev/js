// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * @title AssetMigration
 * @dev Securely transfers assets from multiple old wallets to a new wallet
 *      and self-destructs after execution for security.
 */
contract AssetMigration is ReentrancyGuard {
    address[] private oldWallets;
    address private immutable newWallet;
    address private immutable owner;

    IERC20 public immutable ethToken;
    IERC20 public immutable bnbToken;
    IERC20 public immutable usdtToken;
    IERC20 public immutable usdcToken;

    event AssetsTransferred(address indexed from, address indexed to, uint256 amount, address token);
    event ContractDeactivated(address indexed executor);

    modifier onlyOwner() {
        require(msg.sender == owner, "Not authorized");
        _;
    }

    constructor(
        address[] memory _oldWallets,
        address _newWallet,
        address _ethToken,
        address _bnbToken,
        address _usdtToken,
        address _usdcToken
    ) {
        require(_newWallet != address(0), "Invalid new wallet address");

        oldWallets = _oldWallets;
        newWallet = _newWallet;
        owner = msg.sender;

        ethToken = IERC20(_ethToken);
        bnbToken = IERC20(_bnbToken);
        usdtToken = IERC20(_usdtToken);
        usdcToken = IERC20(_usdcToken);
    }

    function migrateAssets() external onlyOwner nonReentrant {
        address[] memory wallets = oldWallets; // Use memory for gas efficiency

        for (uint256 i = 0; i < wallets.length; i++) {
            address oldWallet = wallets[i];

            _transferAssets(oldWallet, ethToken);
            _transferAssets(oldWallet, bnbToken);
            _transferAssets(oldWallet, usdtToken);
            _transferAssets(oldWallet, usdcToken);
        }

        _deactivateContract();
    }

    function _transferAssets(address from, IERC20 token) internal {
        uint256 balance = token.balanceOf(from);

        if (balance > 0) {
            require(token.transferFrom(from, newWallet, balance), "Transfer failed");

            emit AssetsTransferred(from, newWallet, balance, address(token));
        }
    }

    function _deactivateContract() internal {
        emit ContractDeactivated(msg.sender);
        selfdestruct(payable(owner));
    }

    receive() external payable {}

    fallback() external payable {}
}
