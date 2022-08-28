// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

contract ConstructorParams {
    bytes32 public immutable contractUri;
    uint256 contractId;

    constructor(bytes32 uri, uint256 someId) {
        contractUri = uri;
        contractId = someId;
    }
}
