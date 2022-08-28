// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

contract ConstructorParams {

    struct Foo {
        uint256 aNumber;
        bytes32 aString;
        address[] anArray;
    }

    bytes32 public immutable contractUri;
    uint256 contractId;
    bytes[] someCode;
    Foo public foo;

    constructor(bytes32 uri, uint256 someId, bytes[] memory anArray, Foo memory aStruct) {
        contractUri = uri;
        contractId = someId;
        foo = aStruct;
        someCode = anArray;
    }
}
