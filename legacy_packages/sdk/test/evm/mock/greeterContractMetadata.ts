export const greeterCompilerMetadata = {
  compiler: {
    version: "0.8.4+commit.c7e474f2",
  },
  language: "Solidity",
  output: {
    abi: [
      {
        inputs: [],
        stateMutability: "nonpayable",
        type: "constructor",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: "address",
            name: "owner",
            type: "address",
          },
          {
            indexed: true,
            internalType: "address",
            name: "spender",
            type: "address",
          },
          {
            indexed: false,
            internalType: "uint256",
            name: "value",
            type: "uint256",
          },
        ],
        name: "Approval",
        type: "event",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: false,
            internalType: "address",
            name: "prevOwner",
            type: "address",
          },
          {
            indexed: false,
            internalType: "address",
            name: "newOwner",
            type: "address",
          },
        ],
        name: "OwnerUpdated",
        type: "event",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: "address",
            name: "from",
            type: "address",
          },
          {
            indexed: true,
            internalType: "address",
            name: "to",
            type: "address",
          },
          {
            indexed: false,
            internalType: "uint256",
            name: "value",
            type: "uint256",
          },
        ],
        name: "Transfer",
        type: "event",
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "owner",
            type: "address",
          },
          {
            internalType: "address",
            name: "spender",
            type: "address",
          },
        ],
        name: "allowance",
        outputs: [
          {
            internalType: "uint256",
            name: "",
            type: "uint256",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "spender",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "amount",
            type: "uint256",
          },
        ],
        name: "approve",
        outputs: [
          {
            internalType: "bool",
            name: "",
            type: "bool",
          },
        ],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "account",
            type: "address",
          },
        ],
        name: "balanceOf",
        outputs: [
          {
            internalType: "uint256",
            name: "",
            type: "uint256",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [],
        name: "decimals",
        outputs: [
          {
            internalType: "uint8",
            name: "",
            type: "uint8",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "spender",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "subtractedValue",
            type: "uint256",
          },
        ],
        name: "decreaseAllowance",
        outputs: [
          {
            internalType: "bool",
            name: "",
            type: "bool",
          },
        ],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "spender",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "addedValue",
            type: "uint256",
          },
        ],
        name: "increaseAllowance",
        outputs: [
          {
            internalType: "bool",
            name: "",
            type: "bool",
          },
        ],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [],
        name: "name",
        outputs: [
          {
            internalType: "string",
            name: "",
            type: "string",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [],
        name: "owner",
        outputs: [
          {
            internalType: "address",
            name: "",
            type: "address",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "_newOwner",
            type: "address",
          },
        ],
        name: "setOwner",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [],
        name: "symbol",
        outputs: [
          {
            internalType: "string",
            name: "",
            type: "string",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [],
        name: "totalSupply",
        outputs: [
          {
            internalType: "uint256",
            name: "",
            type: "uint256",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "to",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "amount",
            type: "uint256",
          },
        ],
        name: "transfer",
        outputs: [
          {
            internalType: "bool",
            name: "",
            type: "bool",
          },
        ],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "from",
            type: "address",
          },
          {
            internalType: "address",
            name: "to",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "amount",
            type: "uint256",
          },
        ],
        name: "transferFrom",
        outputs: [
          {
            internalType: "bool",
            name: "",
            type: "bool",
          },
        ],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "deployer",
            type: "address",
          },
        ],
        name: "tw_initializeOwner",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
    ],
    devdoc: {
      kind: "dev",
      methods: {
        "allowance(address,address)": {
          details: "See {IERC20-allowance}.",
        },
        "approve(address,uint256)": {
          details:
            "See {IERC20-approve}. NOTE: If `amount` is the maximum `uint256`, the allowance is not updated on `transferFrom`. This is semantically equivalent to an infinite approval. Requirements: - `spender` cannot be the zero address.",
        },
        "balanceOf(address)": {
          details: "See {IERC20-balanceOf}.",
        },
        "decimals()": {
          details:
            "Returns the number of decimals used to get its user representation. For example, if `decimals` equals `2`, a balance of `505` tokens should be displayed to a user as `5.05` (`505 / 10 ** 2`). Tokens usually opt for a value of 18, imitating the relationship between Ether and Wei. This is the value {ERC20} uses, unless this function is overridden; NOTE: This information is only used for _display_ purposes: it in no way affects any of the arithmetic of the contract, including {IERC20-balanceOf} and {IERC20-transfer}.",
        },
        "decreaseAllowance(address,uint256)": {
          details:
            "Atomically decreases the allowance granted to `spender` by the caller. This is an alternative to {approve} that can be used as a mitigation for problems described in {IERC20-approve}. Emits an {Approval} event indicating the updated allowance. Requirements: - `spender` cannot be the zero address. - `spender` must have allowance for the caller of at least `subtractedValue`.",
        },
        "increaseAllowance(address,uint256)": {
          details:
            "Atomically increases the allowance granted to `spender` by the caller. This is an alternative to {approve} that can be used as a mitigation for problems described in {IERC20-approve}. Emits an {Approval} event indicating the updated allowance. Requirements: - `spender` cannot be the zero address.",
        },
        "name()": {
          details: "Returns the name of the token.",
        },
        "setOwner(address)": {
          details:
            "Lets a contract admin set a new owner for the contract. The new owner must be a contract admin.",
        },
        "symbol()": {
          details:
            "Returns the symbol of the token, usually a shorter version of the name.",
        },
        "totalSupply()": {
          details: "See {IERC20-totalSupply}.",
        },
        "transfer(address,uint256)": {
          details:
            "See {IERC20-transfer}. Requirements: - `to` cannot be the zero address. - the caller must have a balance of at least `amount`.",
        },
        "transferFrom(address,address,uint256)": {
          details:
            "See {IERC20-transferFrom}. Emits an {Approval} event indicating the updated allowance. This is not required by the EIP. See the note at the beginning of {ERC20}. NOTE: Does not update the allowance if the current allowance is the maximum `uint256`. Requirements: - `from` and `to` cannot be the zero address. - `from` must have a balance of at least `amount`. - the caller must have allowance for ``from``'s tokens of at least `amount`.",
        },
        "tw_initializeOwner(address)": {
          details: "Initializes the owner of the contract.",
        },
      },
      version: 1,
    },
    userdoc: {
      kind: "user",
      methods: {},
      version: 1,
    },
  },
  settings: {
    compilationTarget: {
      "contracts/Greeter.sol": "Greeter",
    },
    evmVersion: "istanbul",
    libraries: {},
    metadata: {
      bytecodeHash: "ipfs",
    },
    optimizer: {
      enabled: false,
      runs: 200,
    },
    remappings: [],
  },
  sources: {
    "@openzeppelin/contracts/token/ERC20/ERC20.sol": {
      keccak256:
        "0xe0c8b625a79bac0fe80f17cfb521e072805cc9cef1c96a5caf45b264e74812fa",
      license: "MIT",
      urls: [
        "bzz-raw://12fd1efc9ad061ef675bd50fb0c8e3c6f2952a09f8df0e3c688b8d81b8918838",
        "dweb:/ipfs/QmawN6PjTwy91pU7ANjCSgbsLc8TDA6hwu9GsFFaNSuhb5",
      ],
    },
    "@openzeppelin/contracts/token/ERC20/IERC20.sol": {
      keccak256:
        "0x9750c6b834f7b43000631af5cc30001c5f547b3ceb3635488f140f60e897ea6b",
      license: "MIT",
      urls: [
        "bzz-raw://5a7d5b1ef5d8d5889ad2ed89d8619c09383b80b72ab226e0fe7bde1636481e34",
        "dweb:/ipfs/QmebXWgtEfumQGBdVeM6c71McLixYXQP5Bk6kKXuoY4Bmr",
      ],
    },
    "@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol": {
      keccak256:
        "0x8de418a5503946cabe331f35fe242d3201a73f67f77aaeb7110acb1f30423aca",
      license: "MIT",
      urls: [
        "bzz-raw://5a376d3dda2cb70536c0a45c208b29b34ac560c4cb4f513a42079f96ba47d2dd",
        "dweb:/ipfs/QmZQg6gn1sUpM8wHzwNvSnihumUCAhxD119MpXeKp8B9s8",
      ],
    },
    "@openzeppelin/contracts/utils/Context.sol": {
      keccak256:
        "0xe2e337e6dde9ef6b680e07338c493ebea1b5fd09b43424112868e9cc1706bca7",
      license: "MIT",
      urls: [
        "bzz-raw://6df0ddf21ce9f58271bdfaa85cde98b200ef242a05a3f85c2bc10a8294800a92",
        "dweb:/ipfs/QmRK2Y5Yc6BK7tGKkgsgn3aJEQGi5aakeSPZvS65PV8Xp3",
      ],
    },
    "@thirdweb-dev/contracts/ThirdwebContract.sol": {
      keccak256:
        "0x0da29b16a67c01f708943d11b1e42b9bdf9c6d99395401845d9f00530e22753f",
      license: "Apache-2.0",
      urls: [
        "bzz-raw://b0e86391f7dc937c3ff50324b30c49ed6f58399f45cf47529bc312326646e617",
        "dweb:/ipfs/QmefoozzLddJpDXkLVZ8QF1FjaN6isxt3GTcgourR1kVBn",
      ],
    },
    "@thirdweb-dev/contracts/feature/Ownable.sol": {
      keccak256:
        "0xd189b801fbde5450893afdb42ba5a461df91b1b03cfb335f339cf3e96cf65f43",
      license: "Apache-2.0",
      urls: [
        "bzz-raw://e3153b60d48dd99bb3fdc860eb3fdc58db9c978dd142440ae4e551f4527c1b9f",
        "dweb:/ipfs/QmafoVGSSLEa48DadjVCNsPCLBvUosHZqU2JTZfWHrQFdZ",
      ],
    },
    "@thirdweb-dev/contracts/feature/interface/IOwnable.sol": {
      keccak256:
        "0x2c3ea8c3c1688337d3eacf55b055b51689ab03d6906366e0a8c6959b4794d7c7",
      license: "Apache-2.0",
      urls: [
        "bzz-raw://4136249c9207296acc87bf1ea0999ddf786570efe1fd6986ba9347c9998d7a3d",
        "dweb:/ipfs/Qmd726Pcis1DUtuac6VwHuMKodGt8FhtMZm7BXjdx8EX6a",
      ],
    },
    "@thirdweb-dev/contracts/interfaces/IContractDeployer.sol": {
      keccak256:
        "0x2b883cf46f6cbf1a162e4ff5fb9f9f31dbf6d85d6c4417ddf0e2376af13d63ed",
      license: "Apache-2.0",
      urls: [
        "bzz-raw://4bd2edacff3d7a7a28987b5bea0cb0fd005db858ac542efcff8af3f806102389",
        "dweb:/ipfs/QmTdc27PFikNeFTKiCDbPHGST5mpe2K6UMqjy7cR5j5RY6",
      ],
    },
    "contracts/Greeter.sol": {
      keccak256:
        "0xdb82c2dec0576959a181fbbace013e25c45898bdec5b3530d40d8d9d792148cc",
      license: "MIT",
      urls: [
        "bzz-raw://37097895693d596849ab3a7b623f71a66131550c8f82b2b145aa71da633f8170",
        "dweb:/ipfs/QmWYYc75eAts57gWLH8zf81wZC99dEgUaKYCMXFLa5PMs7",
      ],
    },
  },
  version: 1,
};

export const greeterBytecode =
  "0x60806040523480156200001157600080fd5b506040518060400160405280600781526020017f4d79546f6b656e000000000000000000000000000000000000000000000000008152506040518060400160405280600381526020017f4d544b000000000000000000000000000000000000000000000000000000000081525081600390805190602001906200009692919062000291565b508060049080519060200190620000af92919062000291565b505050620000c733620f42406200010e60201b60201c565b33600560006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550620004ed565b600073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff16141562000181576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401620001789062000379565b60405180910390fd5b62000195600083836200028760201b60201c565b8060026000828254620001a99190620003c9565b92505081905550806000808473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000828254620002009190620003c9565b925050819055508173ffffffffffffffffffffffffffffffffffffffff16600073ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef836040516200026791906200039b565b60405180910390a362000283600083836200028c60201b60201c565b5050565b505050565b505050565b8280546200029f9062000430565b90600052602060002090601f016020900481019282620002c357600085556200030f565b82601f10620002de57805160ff19168380011785556200030f565b828001600101855582156200030f579182015b828111156200030e578251825591602001919060010190620002f1565b5b5090506200031e919062000322565b5090565b5b808211156200033d57600081600090555060010162000323565b5090565b600062000350601f83620003b8565b91506200035d82620004c4565b602082019050919050565b620003738162000426565b82525050565b60006020820190508181036000830152620003948162000341565b9050919050565b6000602082019050620003b2600083018462000368565b92915050565b600082825260208201905092915050565b6000620003d68262000426565b9150620003e38362000426565b9250827fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff038211156200041b576200041a62000466565b5b828201905092915050565b6000819050919050565b600060028204905060018216806200044957607f821691505b6020821081141562000460576200045f62000495565b5b50919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b7f45524332303a206d696e7420746f20746865207a65726f206164647265737300600082015250565b61161080620004fd6000396000f3fe608060405234801561001057600080fd5b50600436106100ea5760003560e01c8063395093511161008c57806395d89b411161006657806395d89b411461025f578063a457c2d71461027d578063a9059cbb146102ad578063dd62ed3e146102dd576100ea565b806339509351146101e157806370a08231146102115780638da5cb5b14610241576100ea565b806313af4035116100c857806313af40351461015957806318160ddd1461017557806323b872dd14610193578063313ce567146101c3576100ea565b806306fdde03146100ef578063095ea7b31461010d57806310ce19a41461013d575b600080fd5b6100f761030d565b6040516101049190611044565b60405180910390f35b61012760048036038101906101229190610df9565b61039f565b6040516101349190611029565b60405180910390f35b61015760048036038101906101529190610d45565b6103c2565b005b610173600480360381019061016e9190610d45565b610453565b005b61017d61053f565b60405161018a9190611186565b60405180910390f35b6101ad60048036038101906101a89190610daa565b610549565b6040516101ba9190611029565b60405180910390f35b6101cb610578565b6040516101d891906111a1565b60405180910390f35b6101fb60048036038101906101f69190610df9565b610581565b6040516102089190611029565b60405180910390f35b61022b60048036038101906102269190610d45565b6105b8565b6040516102389190611186565b60405180910390f35b610249610600565b6040516102569190610fe5565b60405180910390f35b610267610626565b6040516102749190611044565b60405180910390f35b61029760048036038101906102929190610df9565b6106b8565b6040516102a49190611029565b60405180910390f35b6102c760048036038101906102c29190610df9565b61072f565b6040516102d49190611029565b60405180910390f35b6102f760048036038101906102f29190610d6e565b610752565b6040516103049190611186565b60405180910390f35b60606003805461031c906112b6565b80601f0160208091040260200160405190810160405280929190818152602001828054610348906112b6565b80156103955780601f1061036a57610100808354040283529160200191610395565b820191906000526020600020905b81548152906001019060200180831161037857829003601f168201915b5050505050905090565b6000806103aa6107d9565b90506103b78185856107e1565b600191505092915050565b600060065414610407576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016103fe906110e6565b60405180910390fd5b600160068190555080600560006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555050565b61045b6109ac565b61049a576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161049190611166565b60405180910390fd5b6000600560009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16905081600560006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055507f8292fce18fa69edf4db7b94ea2e58241df0ae57f97e0a6c9b29067028bf92d768183604051610533929190611000565b60405180910390a15050565b6000600254905090565b6000806105546107d9565b9050610561858285610a04565b61056c858585610a90565b60019150509392505050565b60006012905090565b60008061058c6107d9565b90506105ad81858561059e8589610752565b6105a891906111d8565b6107e1565b600191505092915050565b60008060008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020549050919050565b600560009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b606060048054610635906112b6565b80601f0160208091040260200160405190810160405280929190818152602001828054610661906112b6565b80156106ae5780601f10610683576101008083540402835291602001916106ae565b820191906000526020600020905b81548152906001019060200180831161069157829003601f168201915b5050505050905090565b6000806106c36107d9565b905060006106d18286610752565b905083811015610716576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161070d90611146565b60405180910390fd5b61072382868684036107e1565b60019250505092915050565b60008061073a6107d9565b9050610747818585610a90565b600191505092915050565b6000600160008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054905092915050565b600033905090565b600073ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff161415610851576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161084890611126565b60405180910390fd5b600073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff1614156108c1576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016108b890611086565b60405180910390fd5b80600160008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020819055508173ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff167f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b9258360405161099f9190611186565b60405180910390a3505050565b6000600560009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614905090565b6000610a108484610752565b90507fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff8114610a8a5781811015610a7c576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610a73906110a6565b60405180910390fd5b610a8984848484036107e1565b5b50505050565b600073ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff161415610b00576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610af790611106565b60405180910390fd5b600073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff161415610b70576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610b6790611066565b60405180910390fd5b610b7b838383610d11565b60008060008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054905081811015610c01576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610bf8906110c6565b60405180910390fd5b8181036000808673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002081905550816000808573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000828254610c9491906111d8565b925050819055508273ffffffffffffffffffffffffffffffffffffffff168473ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef84604051610cf89190611186565b60405180910390a3610d0b848484610d16565b50505050565b505050565b505050565b600081359050610d2a816115ac565b92915050565b600081359050610d3f816115c3565b92915050565b600060208284031215610d5757600080fd5b6000610d6584828501610d1b565b91505092915050565b60008060408385031215610d8157600080fd5b6000610d8f85828601610d1b565b9250506020610da085828601610d1b565b9150509250929050565b600080600060608486031215610dbf57600080fd5b6000610dcd86828701610d1b565b9350506020610dde86828701610d1b565b9250506040610def86828701610d30565b9150509250925092565b60008060408385031215610e0c57600080fd5b6000610e1a85828601610d1b565b9250506020610e2b85828601610d30565b9150509250929050565b610e3e8161122e565b82525050565b610e4d81611240565b82525050565b6000610e5e826111bc565b610e6881856111c7565b9350610e78818560208601611283565b610e8181611346565b840191505092915050565b6000610e996023836111c7565b9150610ea482611357565b604082019050919050565b6000610ebc6022836111c7565b9150610ec7826113a6565b604082019050919050565b6000610edf601d836111c7565b9150610eea826113f5565b602082019050919050565b6000610f026026836111c7565b9150610f0d8261141e565b604082019050919050565b6000610f256019836111c7565b9150610f308261146d565b602082019050919050565b6000610f486025836111c7565b9150610f5382611496565b604082019050919050565b6000610f6b6024836111c7565b9150610f76826114e5565b604082019050919050565b6000610f8e6025836111c7565b9150610f9982611534565b604082019050919050565b6000610fb1600e836111c7565b9150610fbc82611583565b602082019050919050565b610fd08161126c565b82525050565b610fdf81611276565b82525050565b6000602082019050610ffa6000830184610e35565b92915050565b60006040820190506110156000830185610e35565b6110226020830184610e35565b9392505050565b600060208201905061103e6000830184610e44565b92915050565b6000602082019050818103600083015261105e8184610e53565b905092915050565b6000602082019050818103600083015261107f81610e8c565b9050919050565b6000602082019050818103600083015261109f81610eaf565b9050919050565b600060208201905081810360008301526110bf81610ed2565b9050919050565b600060208201905081810360008301526110df81610ef5565b9050919050565b600060208201905081810360008301526110ff81610f18565b9050919050565b6000602082019050818103600083015261111f81610f3b565b9050919050565b6000602082019050818103600083015261113f81610f5e565b9050919050565b6000602082019050818103600083015261115f81610f81565b9050919050565b6000602082019050818103600083015261117f81610fa4565b9050919050565b600060208201905061119b6000830184610fc7565b92915050565b60006020820190506111b66000830184610fd6565b92915050565b600081519050919050565b600082825260208201905092915050565b60006111e38261126c565b91506111ee8361126c565b9250827fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff03821115611223576112226112e8565b5b828201905092915050565b60006112398261124c565b9050919050565b60008115159050919050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b6000819050919050565b600060ff82169050919050565b60005b838110156112a1578082015181840152602081019050611286565b838111156112b0576000848401525b50505050565b600060028204905060018216806112ce57607f821691505b602082108114156112e2576112e1611317565b5b50919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b6000601f19601f8301169050919050565b7f45524332303a207472616e7366657220746f20746865207a65726f206164647260008201527f6573730000000000000000000000000000000000000000000000000000000000602082015250565b7f45524332303a20617070726f766520746f20746865207a65726f20616464726560008201527f7373000000000000000000000000000000000000000000000000000000000000602082015250565b7f45524332303a20696e73756666696369656e7420616c6c6f77616e6365000000600082015250565b7f45524332303a207472616e7366657220616d6f756e742065786365656473206260008201527f616c616e63650000000000000000000000000000000000000000000000000000602082015250565b7f4f776e657220616c726561647920696e697469616c697a656400000000000000600082015250565b7f45524332303a207472616e736665722066726f6d20746865207a65726f20616460008201527f6472657373000000000000000000000000000000000000000000000000000000602082015250565b7f45524332303a20617070726f76652066726f6d20746865207a65726f2061646460008201527f7265737300000000000000000000000000000000000000000000000000000000602082015250565b7f45524332303a2064656372656173656420616c6c6f77616e63652062656c6f7760008201527f207a65726f000000000000000000000000000000000000000000000000000000602082015250565b7f4e6f7420617574686f72697a6564000000000000000000000000000000000000600082015250565b6115b58161122e565b81146115c057600080fd5b50565b6115cc8161126c565b81146115d757600080fd5b5056fea2646970667358221220d5109ccee5486f19e9fe49cabe26a29053455a166e11b09abfb66d0baddacb9f64736f6c63430008040033";
