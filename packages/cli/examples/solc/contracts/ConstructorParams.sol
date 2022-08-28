// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@thirdweb-dev/contracts/ThirdwebContract.sol";

contract ConstructorParams is ThirdwebContract {
    bytes32 public immutable contractUri;
    uint256 contractId;

    constructor(bytes32 uri, uint256 someId) {
        contractUri = uri;
        contractId = someId;
    }
}
