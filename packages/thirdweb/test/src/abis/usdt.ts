export const USDT_ABI = [
  {
    type: "function",
    name: "name",
    inputs: [],
    outputs: [
      {
        type: "string",
        name: "",
      },
    ],
    constant: true,
    payable: false,
    stateMutability: "view",
  },
  {
    type: "function",
    name: "deprecate",
    inputs: [
      {
        type: "address",
        name: "_upgradedAddress",
      },
    ],
    outputs: [],
    constant: false,
    payable: false,
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "approve",
    inputs: [
      {
        type: "address",
        name: "_spender",
      },
      {
        type: "uint256",
        name: "_value",
      },
    ],
    outputs: [],
    constant: false,
    payable: false,
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "deprecated",
    inputs: [],
    outputs: [
      {
        type: "bool",
        name: "",
      },
    ],
    constant: true,
    payable: false,
    stateMutability: "view",
  },
  {
    type: "function",
    name: "addBlackList",
    inputs: [
      {
        type: "address",
        name: "_evilUser",
      },
    ],
    outputs: [],
    constant: false,
    payable: false,
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "totalSupply",
    inputs: [],
    outputs: [
      {
        type: "uint256",
        name: "",
      },
    ],
    constant: true,
    payable: false,
    stateMutability: "view",
  },
  {
    type: "function",
    name: "transferFrom",
    inputs: [
      {
        type: "address",
        name: "_from",
      },
      {
        type: "address",
        name: "_to",
      },
      {
        type: "uint256",
        name: "_value",
      },
    ],
    outputs: [],
    constant: false,
    payable: false,
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "upgradedAddress",
    inputs: [],
    outputs: [
      {
        type: "address",
        name: "",
      },
    ],
    constant: true,
    payable: false,
    stateMutability: "view",
  },
  {
    type: "function",
    name: "balances",
    inputs: [
      {
        type: "address",
        name: "",
      },
    ],
    outputs: [
      {
        type: "uint256",
        name: "",
      },
    ],
    constant: true,
    payable: false,
    stateMutability: "view",
  },
  {
    type: "function",
    name: "decimals",
    inputs: [],
    outputs: [
      {
        type: "uint256",
        name: "",
      },
    ],
    constant: true,
    payable: false,
    stateMutability: "view",
  },
  {
    type: "function",
    name: "maximumFee",
    inputs: [],
    outputs: [
      {
        type: "uint256",
        name: "",
      },
    ],
    constant: true,
    payable: false,
    stateMutability: "view",
  },
  {
    type: "function",
    name: "_totalSupply",
    inputs: [],
    outputs: [
      {
        type: "uint256",
        name: "",
      },
    ],
    constant: true,
    payable: false,
    stateMutability: "view",
  },
  {
    type: "function",
    name: "unpause",
    inputs: [],
    outputs: [],
    constant: false,
    payable: false,
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "getBlackListStatus",
    inputs: [
      {
        type: "address",
        name: "_maker",
      },
    ],
    outputs: [
      {
        type: "bool",
        name: "",
      },
    ],
    constant: true,
    payable: false,
    stateMutability: "view",
  },
  {
    type: "function",
    name: "allowed",
    inputs: [
      {
        type: "address",
        name: "",
      },
      {
        type: "address",
        name: "",
      },
    ],
    outputs: [
      {
        type: "uint256",
        name: "",
      },
    ],
    constant: true,
    payable: false,
    stateMutability: "view",
  },
  {
    type: "function",
    name: "paused",
    inputs: [],
    outputs: [
      {
        type: "bool",
        name: "",
      },
    ],
    constant: true,
    payable: false,
    stateMutability: "view",
  },
  {
    type: "function",
    name: "balanceOf",
    inputs: [
      {
        type: "address",
        name: "who",
      },
    ],
    outputs: [
      {
        type: "uint256",
        name: "",
      },
    ],
    constant: true,
    payable: false,
    stateMutability: "view",
  },
  {
    type: "function",
    name: "pause",
    inputs: [],
    outputs: [],
    constant: false,
    payable: false,
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "getOwner",
    inputs: [],
    outputs: [
      {
        type: "address",
        name: "",
      },
    ],
    constant: true,
    payable: false,
    stateMutability: "view",
  },
  {
    type: "function",
    name: "owner",
    inputs: [],
    outputs: [
      {
        type: "address",
        name: "",
      },
    ],
    constant: true,
    payable: false,
    stateMutability: "view",
  },
  {
    type: "function",
    name: "symbol",
    inputs: [],
    outputs: [
      {
        type: "string",
        name: "",
      },
    ],
    constant: true,
    payable: false,
    stateMutability: "view",
  },
  {
    type: "function",
    name: "transfer",
    inputs: [
      {
        type: "address",
        name: "_to",
      },
      {
        type: "uint256",
        name: "_value",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "setParams",
    inputs: [
      {
        type: "uint256",
        name: "newBasisPoints",
      },
      {
        type: "uint256",
        name: "newMaxFee",
      },
    ],
    outputs: [],
    constant: false,
    payable: false,
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "issue",
    inputs: [
      {
        type: "uint256",
        name: "amount",
      },
    ],
    outputs: [],
    constant: false,
    payable: false,
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "redeem",
    inputs: [
      {
        type: "uint256",
        name: "amount",
      },
    ],
    outputs: [],
    constant: false,
    payable: false,
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "allowance",
    inputs: [
      {
        type: "address",
        name: "_owner",
      },
      {
        type: "address",
        name: "_spender",
      },
    ],
    outputs: [
      {
        type: "uint256",
        name: "remaining",
      },
    ],
    constant: true,
    payable: false,
    stateMutability: "view",
  },
  {
    type: "function",
    name: "basisPointsRate",
    inputs: [],
    outputs: [
      {
        type: "uint256",
        name: "",
      },
    ],
    constant: true,
    payable: false,
    stateMutability: "view",
  },
  {
    type: "function",
    name: "isBlackListed",
    inputs: [
      {
        type: "address",
        name: "",
      },
    ],
    outputs: [
      {
        type: "bool",
        name: "",
      },
    ],
    constant: true,
    payable: false,
    stateMutability: "view",
  },
  {
    type: "function",
    name: "removeBlackList",
    inputs: [
      {
        type: "address",
        name: "_clearedUser",
      },
    ],
    outputs: [],
    constant: false,
    payable: false,
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "MAX_UINT",
    inputs: [],
    outputs: [
      {
        type: "uint256",
        name: "",
      },
    ],
    constant: true,
    payable: false,
    stateMutability: "view",
  },
  {
    type: "function",
    name: "transferOwnership",
    inputs: [
      {
        type: "address",
        name: "newOwner",
      },
    ],
    outputs: [],
    constant: false,
    payable: false,
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "destroyBlackFunds",
    inputs: [
      {
        type: "address",
        name: "_blackListedUser",
      },
    ],
    outputs: [],
    constant: false,
    payable: false,
    stateMutability: "nonpayable",
  },
  {
    type: "constructor",
    name: "",
    inputs: [
      {
        type: "uint256",
        name: "_initialSupply",
      },
      {
        type: "string",
        name: "_name",
      },
      {
        type: "string",
        name: "_symbol",
      },
      {
        type: "uint256",
        name: "_decimals",
      },
    ],
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
  },
  {
    type: "event",
    name: "Issue",
    inputs: [
      {
        type: "uint256",
        name: "amount",
        indexed: false,
      },
    ],
    outputs: [],
    anonymous: false,
  },
  {
    type: "event",
    name: "Redeem",
    inputs: [
      {
        type: "uint256",
        name: "amount",
        indexed: false,
      },
    ],
    outputs: [],
    anonymous: false,
  },
  {
    type: "event",
    name: "Deprecate",
    inputs: [
      {
        type: "address",
        name: "newAddress",
        indexed: false,
      },
    ],
    outputs: [],
    anonymous: false,
  },
  {
    type: "event",
    name: "Params",
    inputs: [
      {
        type: "uint256",
        name: "feeBasisPoints",
        indexed: false,
      },
      {
        type: "uint256",
        name: "maxFee",
        indexed: false,
      },
    ],
    outputs: [],
    anonymous: false,
  },
  {
    type: "event",
    name: "DestroyedBlackFunds",
    inputs: [
      {
        type: "address",
        name: "_blackListedUser",
        indexed: false,
      },
      {
        type: "uint256",
        name: "_balance",
        indexed: false,
      },
    ],
    outputs: [],
    anonymous: false,
  },
  {
    type: "event",
    name: "AddedBlackList",
    inputs: [
      {
        type: "address",
        name: "_user",
        indexed: false,
      },
    ],
    outputs: [],
    anonymous: false,
  },
  {
    type: "event",
    name: "RemovedBlackList",
    inputs: [
      {
        type: "address",
        name: "_user",
        indexed: false,
      },
    ],
    outputs: [],
    anonymous: false,
  },
  {
    type: "event",
    name: "Approval",
    inputs: [
      {
        type: "address",
        name: "owner",
        indexed: true,
      },
      {
        type: "address",
        name: "spender",
        indexed: true,
      },
      {
        type: "uint256",
        name: "value",
        indexed: false,
      },
    ],
    outputs: [],
    anonymous: false,
  },
  {
    type: "event",
    name: "Transfer",
    inputs: [
      {
        type: "address",
        name: "from",
        indexed: true,
      },
      {
        type: "address",
        name: "to",
        indexed: true,
      },
      {
        type: "uint256",
        name: "value",
        indexed: false,
      },
    ],
    outputs: [],
    anonymous: false,
  },
  {
    type: "event",
    name: "Pause",
    inputs: [],
    outputs: [],
    anonymous: false,
  },
  {
    type: "event",
    name: "Unpause",
    inputs: [],
    outputs: [],
    anonymous: false,
  },
] as const;
