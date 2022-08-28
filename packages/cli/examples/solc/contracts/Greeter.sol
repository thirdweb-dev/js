// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@thirdweb-dev/contracts/ThirdwebContract.sol";

contract Greeter is ERC20, ThirdwebContract {
    constructor() ERC20("MyToken", "MTK") {}
}
