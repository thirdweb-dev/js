// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract GreeterWithDifferentName is ERC20 {
    constructor() ERC20("MyToken2", "MTK") {}
}
