// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Events is ERC20 {

    event MyEvent(uint256 money);

    constructor() ERC20("MyToken2", "MTK") {}
}
