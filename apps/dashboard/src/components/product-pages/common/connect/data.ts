export const connectPlaygroundData = {
  writeFunctions: [
    {
      inputs: [
        {
          type: "address",
          name: "account",
          internalType: "address",
        },
      ],
      outputs: [],
      name: "addKeyGranter",
      signature:
        'contract.call("addKeyGranter", [account: string]): Promise<TransactionResult>',
      stateMutability: "nonpayable",
    },
    {
      inputs: [
        {
          type: "address",
          name: "account",
          internalType: "address",
        },
      ],
      outputs: [],
      name: "addLockManager",
      signature:
        'contract.call("addLockManager", [account: string]): Promise<TransactionResult>',
      stateMutability: "nonpayable",
    },
    {
      inputs: [
        {
          type: "address",
          name: "_approved",
          internalType: "address",
        },
        {
          type: "uint256",
          name: "_tokenId",
          internalType: "uint256",
        },
      ],
      outputs: [],
      name: "approve",
      signature:
        'contract.call("approve", [_approved: string, _tokenId: BigNumberish]): Promise<TransactionResult>',
      stateMutability: "nonpayable",
    },
    {
      inputs: [
        {
          type: "uint256",
          name: "_tokenId",
          internalType: "uint256",
        },
      ],
      outputs: [],
      name: "burn",
      signature:
        'contract.call("burn", [_tokenId: BigNumberish]): Promise<TransactionResult>',
      stateMutability: "nonpayable",
    },
    {
      inputs: [
        {
          type: "uint256",
          name: "_tokenId",
          internalType: "uint256",
        },
      ],
      outputs: [],
      name: "cancelAndRefund",
      signature:
        'contract.call("cancelAndRefund", [_tokenId: BigNumberish]): Promise<TransactionResult>',
      stateMutability: "nonpayable",
    },
    {
      inputs: [
        {
          type: "uint256",
          name: "_tokenId",
          internalType: "uint256",
        },
        {
          type: "uint256",
          name: "_amount",
          internalType: "uint256",
        },
      ],
      outputs: [],
      name: "expireAndRefundFor",
      signature:
        'contract.call("expireAndRefundFor", [_tokenId: BigNumberish, _amount: BigNumberish]): Promise<TransactionResult>',
      stateMutability: "nonpayable",
    },
    {
      inputs: [
        {
          type: "uint256",
          name: "_value",
          internalType: "uint256",
        },
        {
          type: "uint256",
          name: "_tokenId",
          internalType: "uint256",
        },
        {
          type: "address",
          name: "_referrer",
          internalType: "address",
        },
        {
          type: "bytes",
          name: "_data",
          internalType: "bytes",
        },
      ],
      outputs: [],
      name: "extend",
      signature:
        'contract.call("extend", [_value: BigNumberish, _tokenId: BigNumberish, _referrer: string, _data: BytesLike]): Promise<TransactionResult>',
      stateMutability: "payable",
    },
    {
      inputs: [
        {
          type: "uint256",
          name: "_tokenId",
          internalType: "uint256",
        },
        {
          type: "uint256",
          name: "_duration",
          internalType: "uint256",
        },
      ],
      outputs: [],
      name: "grantKeyExtension",
      signature:
        'contract.call("grantKeyExtension", [_tokenId: BigNumberish, _duration: BigNumberish]): Promise<TransactionResult>',
      stateMutability: "nonpayable",
    },
    {
      inputs: [
        {
          type: "address[]",
          name: "_recipients",
          internalType: "address[]",
        },
        {
          type: "uint256[]",
          name: "_expirationTimestamps",
          internalType: "uint256[]",
        },
        {
          type: "address[]",
          name: "_keyManagers",
          internalType: "address[]",
        },
      ],
      outputs: [
        {
          type: "uint256[]",
          name: "",
          internalType: "uint256[]",
        },
      ],
      name: "grantKeys",
      signature:
        'contract.call("grantKeys", [_recipients: string[], _expirationTimestamps: BigNumberish[], _keyManagers: string[]]): Promise<BigNumber[]>',
      stateMutability: "nonpayable",
    },
    {
      inputs: [
        {
          type: "bytes32",
          name: "role",
          internalType: "bytes32",
        },
        {
          type: "address",
          name: "account",
          internalType: "address",
        },
      ],
      outputs: [],
      name: "grantRole",
      signature:
        'contract.call("grantRole", [role: BytesLike, account: string]): Promise<TransactionResult>',
      stateMutability: "nonpayable",
    },
    {
      inputs: [
        {
          type: "address",
          name: "_lockCreator",
          internalType: "address payable",
        },
        {
          type: "uint256",
          name: "_expirationDuration",
          internalType: "uint256",
        },
        {
          type: "address",
          name: "_tokenAddress",
          internalType: "address",
        },
        {
          type: "uint256",
          name: "_keyPrice",
          internalType: "uint256",
        },
        {
          type: "uint256",
          name: "_maxNumberOfKeys",
          internalType: "uint256",
        },
        {
          type: "string",
          name: "_lockName",
          internalType: "string",
        },
      ],
      outputs: [],
      name: "initialize",
      signature:
        'contract.call("initialize", [_lockCreator: string, _expirationDuration: BigNumberish, _tokenAddress: string, _keyPrice: BigNumberish, _maxNumberOfKeys: BigNumberish, _lockName: string]): Promise<TransactionResult>',
      stateMutability: "nonpayable",
    },
    {
      inputs: [
        {
          type: "address",
          name: "_from",
          internalType: "address",
        },
        {
          type: "address",
          name: "_recipient",
          internalType: "address",
        },
        {
          type: "uint256",
          name: "_tokenId",
          internalType: "uint256",
        },
      ],
      outputs: [],
      name: "lendKey",
      signature:
        'contract.call("lendKey", [_from: string, _recipient: string, _tokenId: BigNumberish]): Promise<TransactionResult>',
      stateMutability: "nonpayable",
    },
    {
      inputs: [
        {
          type: "uint256",
          name: "_tokenIdFrom",
          internalType: "uint256",
        },
        {
          type: "uint256",
          name: "_tokenIdTo",
          internalType: "uint256",
        },
        {
          type: "uint256",
          name: "_amount",
          internalType: "uint256",
        },
      ],
      outputs: [],
      name: "mergeKeys",
      signature:
        'contract.call("mergeKeys", [_tokenIdFrom: BigNumberish, _tokenIdTo: BigNumberish, _amount: BigNumberish]): Promise<TransactionResult>',
      stateMutability: "nonpayable",
    },
    {
      inputs: [
        {
          type: "bytes",
          name: "",
          internalType: "bytes",
        },
      ],
      outputs: [],
      name: "migrate",
      signature:
        'contract.call("migrate", [key: BytesLike]): Promise<TransactionResult>',
      stateMutability: "nonpayable",
    },
    {
      inputs: [
        {
          type: "uint256[]",
          name: "_values",
          internalType: "uint256[]",
        },
        {
          type: "address[]",
          name: "_recipients",
          internalType: "address[]",
        },
        {
          type: "address[]",
          name: "_referrers",
          internalType: "address[]",
        },
        {
          type: "address[]",
          name: "_keyManagers",
          internalType: "address[]",
        },
        {
          type: "bytes[]",
          name: "_data",
          internalType: "bytes[]",
        },
      ],
      outputs: [
        {
          type: "uint256[]",
          name: "",
          internalType: "uint256[]",
        },
      ],
      name: "purchase",
      signature:
        'contract.call("purchase", [_values: BigNumberish[], _recipients: string[], _referrers: string[], _keyManagers: string[], _data: BytesLike[]]): Promise<BigNumber[]>',
      stateMutability: "payable",
    },
    {
      inputs: [
        {
          type: "uint256",
          name: "_tokenId",
          internalType: "uint256",
        },
        {
          type: "address",
          name: "_referrer",
          internalType: "address",
        },
      ],
      outputs: [],
      name: "renewMembershipFor",
      signature:
        'contract.call("renewMembershipFor", [_tokenId: BigNumberish, _referrer: string]): Promise<TransactionResult>',
      stateMutability: "nonpayable",
    },
    {
      inputs: [],
      outputs: [],
      name: "renounceLockManager",
      signature:
        'contract.call("renounceLockManager"): Promise<TransactionResult>',
      stateMutability: "nonpayable",
    },
    {
      inputs: [
        {
          type: "bytes32",
          name: "role",
          internalType: "bytes32",
        },
        {
          type: "address",
          name: "account",
          internalType: "address",
        },
      ],
      outputs: [],
      name: "renounceRole",
      signature:
        'contract.call("renounceRole", [role: BytesLike, account: string]): Promise<TransactionResult>',
      stateMutability: "nonpayable",
    },
    {
      inputs: [
        {
          type: "address",
          name: "_granter",
          internalType: "address",
        },
      ],
      outputs: [],
      name: "revokeKeyGranter",
      signature:
        'contract.call("revokeKeyGranter", [_granter: string]): Promise<TransactionResult>',
      stateMutability: "nonpayable",
    },
    {
      inputs: [
        {
          type: "bytes32",
          name: "role",
          internalType: "bytes32",
        },
        {
          type: "address",
          name: "account",
          internalType: "address",
        },
      ],
      outputs: [],
      name: "revokeRole",
      signature:
        'contract.call("revokeRole", [role: BytesLike, account: string]): Promise<TransactionResult>',
      stateMutability: "nonpayable",
    },
    {
      inputs: [
        {
          type: "address",
          name: "_from",
          internalType: "address",
        },
        {
          type: "address",
          name: "_to",
          internalType: "address",
        },
        {
          type: "uint256",
          name: "_tokenId",
          internalType: "uint256",
        },
      ],
      outputs: [],
      name: "safeTransferFrom",
      signature:
        'contract.call("safeTransferFrom", [_from: string, _to: string, _tokenId: BigNumberish]): Promise<TransactionResult>',
      stateMutability: "nonpayable",
    },
    {
      inputs: [
        {
          type: "address",
          name: "_from",
          internalType: "address",
        },
        {
          type: "address",
          name: "_to",
          internalType: "address",
        },
        {
          type: "uint256",
          name: "_tokenId",
          internalType: "uint256",
        },
        {
          type: "bytes",
          name: "_data",
          internalType: "bytes",
        },
      ],
      outputs: [],
      name: "safeTransferFrom",
      signature:
        'contract.call("safeTransferFrom", [_from: string, _to: string, _tokenId: BigNumberish, _data: BytesLike]): Promise<TransactionResult>',
      stateMutability: "nonpayable",
    },
    {
      inputs: [
        {
          type: "address",
          name: "_to",
          internalType: "address",
        },
        {
          type: "bool",
          name: "_approved",
          internalType: "bool",
        },
      ],
      outputs: [],
      name: "setApprovalForAll",
      signature:
        'contract.call("setApprovalForAll", [_to: string, _approved: boolean]): Promise<TransactionResult>',
      stateMutability: "nonpayable",
    },
    {
      inputs: [
        {
          type: "address",
          name: "_onKeyPurchaseHook",
          internalType: "address",
        },
        {
          type: "address",
          name: "_onKeyCancelHook",
          internalType: "address",
        },
        {
          type: "address",
          name: "_onValidKeyHook",
          internalType: "address",
        },
        {
          type: "address",
          name: "_onTokenURIHook",
          internalType: "address",
        },
        {
          type: "address",
          name: "_onKeyTransferHook",
          internalType: "address",
        },
        {
          type: "address",
          name: "_onKeyExtendHook",
          internalType: "address",
        },
        {
          type: "address",
          name: "_onKeyGrantHook",
          internalType: "address",
        },
      ],
      outputs: [],
      name: "setEventHooks",
      signature:
        'contract.call("setEventHooks", [_onKeyPurchaseHook: string, _onKeyCancelHook: string, _onValidKeyHook: string, _onTokenURIHook: string, _onKeyTransferHook: string, _onKeyExtendHook: string, _onKeyGrantHook: string]): Promise<TransactionResult>',
      stateMutability: "nonpayable",
    },
    {
      inputs: [
        {
          type: "uint256",
          name: "_refundValue",
          internalType: "uint256",
        },
      ],
      outputs: [],
      name: "setGasRefundValue",
      signature:
        'contract.call("setGasRefundValue", [_refundValue: BigNumberish]): Promise<TransactionResult>',
      stateMutability: "nonpayable",
    },
    {
      inputs: [
        {
          type: "uint256",
          name: "_tokenId",
          internalType: "uint256",
        },
        {
          type: "address",
          name: "_keyManager",
          internalType: "address",
        },
      ],
      outputs: [],
      name: "setKeyManagerOf",
      signature:
        'contract.call("setKeyManagerOf", [_tokenId: BigNumberish, _keyManager: string]): Promise<TransactionResult>',
      stateMutability: "nonpayable",
    },
    {
      inputs: [
        {
          type: "string",
          name: "_lockName",
          internalType: "string",
        },
        {
          type: "string",
          name: "_lockSymbol",
          internalType: "string",
        },
        {
          type: "string",
          name: "_baseTokenURI",
          internalType: "string",
        },
      ],
      outputs: [],
      name: "setLockMetadata",
      signature:
        'contract.call("setLockMetadata", [_lockName: string, _lockSymbol: string, _baseTokenURI: string]): Promise<TransactionResult>',
      stateMutability: "nonpayable",
    },
    {
      inputs: [
        {
          type: "address",
          name: "account",
          internalType: "address",
        },
      ],
      outputs: [],
      name: "setOwner",
      signature:
        'contract.call("setOwner", [account: string]): Promise<TransactionResult>',
      stateMutability: "nonpayable",
    },
    {
      inputs: [
        {
          type: "address",
          name: "_referrer",
          internalType: "address",
        },
        {
          type: "uint256",
          name: "_feeBasisPoint",
          internalType: "uint256",
        },
      ],
      outputs: [],
      name: "setReferrerFee",
      signature:
        'contract.call("setReferrerFee", [_referrer: string, _feeBasisPoint: BigNumberish]): Promise<TransactionResult>',
      stateMutability: "nonpayable",
    },
    {
      inputs: [
        {
          type: "address",
          name: "_to",
          internalType: "address",
        },
        {
          type: "uint256",
          name: "_tokenIdFrom",
          internalType: "uint256",
        },
        {
          type: "uint256",
          name: "_timeShared",
          internalType: "uint256",
        },
      ],
      outputs: [],
      name: "shareKey",
      signature:
        'contract.call("shareKey", [_to: string, _tokenIdFrom: BigNumberish, _timeShared: BigNumberish]): Promise<TransactionResult>',
      stateMutability: "nonpayable",
    },
    {
      inputs: [
        {
          type: "uint256",
          name: "_tokenId",
          internalType: "uint256",
        },
        {
          type: "address",
          name: "_to",
          internalType: "address",
        },
        {
          type: "uint256",
          name: "_valueBasisPoint",
          internalType: "uint256",
        },
      ],
      outputs: [
        {
          type: "bool",
          name: "success",
          internalType: "bool",
        },
      ],
      name: "transfer",
      signature:
        'contract.call("transfer", [_tokenId: BigNumberish, _to: string, _valueBasisPoint: BigNumberish]): Promise<boolean>',
      stateMutability: "nonpayable",
    },
    {
      inputs: [
        {
          type: "address",
          name: "_from",
          internalType: "address",
        },
        {
          type: "address",
          name: "_recipient",
          internalType: "address",
        },
        {
          type: "uint256",
          name: "_tokenId",
          internalType: "uint256",
        },
      ],
      outputs: [],
      name: "transferFrom",
      signature:
        'contract.call("transferFrom", [_from: string, _recipient: string, _tokenId: BigNumberish]): Promise<TransactionResult>',
      stateMutability: "nonpayable",
    },
    {
      inputs: [
        {
          type: "address",
          name: "_recipient",
          internalType: "address",
        },
        {
          type: "uint256",
          name: "_tokenId",
          internalType: "uint256",
        },
      ],
      outputs: [],
      name: "unlendKey",
      signature:
        'contract.call("unlendKey", [_recipient: string, _tokenId: BigNumberish]): Promise<TransactionResult>',
      stateMutability: "nonpayable",
    },
    {
      inputs: [
        {
          type: "uint256",
          name: "_keyPrice",
          internalType: "uint256",
        },
        {
          type: "address",
          name: "_tokenAddress",
          internalType: "address",
        },
      ],
      outputs: [],
      name: "updateKeyPricing",
      signature:
        'contract.call("updateKeyPricing", [_keyPrice: BigNumberish, _tokenAddress: string]): Promise<TransactionResult>',
      stateMutability: "nonpayable",
    },
    {
      inputs: [
        {
          type: "uint256",
          name: "_newExpirationDuration",
          internalType: "uint256",
        },
        {
          type: "uint256",
          name: "_maxNumberOfKeys",
          internalType: "uint256",
        },
        {
          type: "uint256",
          name: "_maxKeysPerAcccount",
          internalType: "uint256",
        },
      ],
      outputs: [],
      name: "updateLockConfig",
      signature:
        'contract.call("updateLockConfig", [_newExpirationDuration: BigNumberish, _maxNumberOfKeys: BigNumberish, _maxKeysPerAcccount: BigNumberish]): Promise<TransactionResult>',
      stateMutability: "nonpayable",
    },
    {
      inputs: [
        {
          type: "uint256",
          name: "_freeTrialLength",
          internalType: "uint256",
        },
        {
          type: "uint256",
          name: "_refundPenaltyBasisPoints",
          internalType: "uint256",
        },
      ],
      outputs: [],
      name: "updateRefundPenalty",
      signature:
        'contract.call("updateRefundPenalty", [_freeTrialLength: BigNumberish, _refundPenaltyBasisPoints: BigNumberish]): Promise<TransactionResult>',
      stateMutability: "nonpayable",
    },
    {
      inputs: [],
      outputs: [],
      name: "updateSchemaVersion",
      signature:
        'contract.call("updateSchemaVersion"): Promise<TransactionResult>',
      stateMutability: "nonpayable",
    },
    {
      inputs: [
        {
          type: "uint256",
          name: "_transferFeeBasisPoints",
          internalType: "uint256",
        },
      ],
      outputs: [],
      name: "updateTransferFee",
      signature:
        'contract.call("updateTransferFee", [_transferFeeBasisPoints: BigNumberish]): Promise<TransactionResult>',
      stateMutability: "nonpayable",
    },
    {
      inputs: [
        {
          type: "address",
          name: "_tokenAddress",
          internalType: "address",
        },
        {
          type: "address",
          name: "_recipient",
          internalType: "address payable",
        },
        {
          type: "uint256",
          name: "_amount",
          internalType: "uint256",
        },
      ],
      outputs: [],
      name: "withdraw",
      signature:
        'contract.call("withdraw", [_tokenAddress: string, _recipient: string, _amount: BigNumberish]): Promise<TransactionResult>',
      stateMutability: "nonpayable",
    },
  ],
  readFunctions: [
    {
      inputs: [],
      outputs: [
        {
          type: "bytes32",
          name: "",
          internalType: "bytes32",
        },
      ],
      name: "DEFAULT_ADMIN_ROLE",
      signature: 'contract.call("DEFAULT_ADMIN_ROLE"): Promise<BytesLike>',
      stateMutability: "view",
    },
    {
      inputs: [],
      outputs: [
        {
          type: "bytes32",
          name: "",
          internalType: "bytes32",
        },
      ],
      name: "KEY_GRANTER_ROLE",
      signature: 'contract.call("KEY_GRANTER_ROLE"): Promise<BytesLike>',
      stateMutability: "view",
    },
    {
      inputs: [],
      outputs: [
        {
          type: "bytes32",
          name: "",
          internalType: "bytes32",
        },
      ],
      name: "LOCK_MANAGER_ROLE",
      signature: 'contract.call("LOCK_MANAGER_ROLE"): Promise<BytesLike>',
      stateMutability: "view",
    },
    {
      inputs: [
        {
          type: "address",
          name: "_keyOwner",
          internalType: "address",
        },
      ],
      outputs: [
        {
          type: "uint256",
          name: "balance",
          internalType: "uint256",
        },
      ],
      name: "balanceOf",
      signature:
        'contract.call("balanceOf", [_keyOwner: string]): Promise<BigNumber>',
      stateMutability: "view",
    },
    {
      inputs: [],
      outputs: [
        {
          type: "uint256",
          name: "",
          internalType: "uint256",
        },
      ],
      name: "expirationDuration",
      signature: 'contract.call("expirationDuration"): Promise<BigNumber>',
      stateMutability: "view",
    },
    {
      inputs: [],
      outputs: [
        {
          type: "uint256",
          name: "",
          internalType: "uint256",
        },
      ],
      name: "freeTrialLength",
      signature: 'contract.call("freeTrialLength"): Promise<BigNumber>',
      stateMutability: "view",
    },
    {
      inputs: [],
      outputs: [
        {
          type: "uint256",
          name: "_refundValue",
          internalType: "uint256",
        },
      ],
      name: "gasRefundValue",
      signature: 'contract.call("gasRefundValue"): Promise<BigNumber>',
      stateMutability: "view",
    },
    {
      inputs: [
        {
          type: "uint256",
          name: "_tokenId",
          internalType: "uint256",
        },
      ],
      outputs: [
        {
          type: "address",
          name: "",
          internalType: "address",
        },
      ],
      name: "getApproved",
      signature:
        'contract.call("getApproved", [_tokenId: BigNumberish]): Promise<string>',
      stateMutability: "view",
    },
    {
      inputs: [
        {
          type: "uint256",
          name: "_tokenId",
          internalType: "uint256",
        },
      ],
      outputs: [
        {
          type: "uint256",
          name: "refund",
          internalType: "uint256",
        },
      ],
      name: "getCancelAndRefundValue",
      signature:
        'contract.call("getCancelAndRefundValue", [_tokenId: BigNumberish]): Promise<BigNumber>',
      stateMutability: "view",
    },
    {
      inputs: [
        {
          type: "address",
          name: "_keyOwner",
          internalType: "address",
        },
      ],
      outputs: [
        {
          type: "bool",
          name: "isValid",
          internalType: "bool",
        },
      ],
      name: "getHasValidKey",
      signature:
        'contract.call("getHasValidKey", [_keyOwner: string]): Promise<boolean>',
      stateMutability: "view",
    },
    {
      inputs: [
        {
          type: "bytes32",
          name: "role",
          internalType: "bytes32",
        },
      ],
      outputs: [
        {
          type: "bytes32",
          name: "",
          internalType: "bytes32",
        },
      ],
      name: "getRoleAdmin",
      signature:
        'contract.call("getRoleAdmin", [role: BytesLike]): Promise<BytesLike>',
      stateMutability: "view",
    },
    {
      inputs: [
        {
          type: "uint256",
          name: "_tokenId",
          internalType: "uint256",
        },
        {
          type: "uint256",
          name: "_time",
          internalType: "uint256",
        },
      ],
      outputs: [
        {
          type: "uint256",
          name: "",
          internalType: "uint256",
        },
      ],
      name: "getTransferFee",
      signature:
        'contract.call("getTransferFee", [_tokenId: BigNumberish, _time: BigNumberish]): Promise<BigNumber>',
      stateMutability: "view",
    },
    {
      inputs: [
        {
          type: "bytes32",
          name: "role",
          internalType: "bytes32",
        },
        {
          type: "address",
          name: "account",
          internalType: "address",
        },
      ],
      outputs: [
        {
          type: "bool",
          name: "",
          internalType: "bool",
        },
      ],
      name: "hasRole",
      signature:
        'contract.call("hasRole", [role: BytesLike, account: string]): Promise<boolean>',
      stateMutability: "view",
    },
    {
      inputs: [
        {
          type: "address",
          name: "_owner",
          internalType: "address",
        },
        {
          type: "address",
          name: "_operator",
          internalType: "address",
        },
      ],
      outputs: [
        {
          type: "bool",
          name: "",
          internalType: "bool",
        },
      ],
      name: "isApprovedForAll",
      signature:
        'contract.call("isApprovedForAll", [_owner: string, _operator: string]): Promise<boolean>',
      stateMutability: "view",
    },
    {
      inputs: [
        {
          type: "address",
          name: "account",
          internalType: "address",
        },
      ],
      outputs: [
        {
          type: "bool",
          name: "",
          internalType: "bool",
        },
      ],
      name: "isKeyGranter",
      signature:
        'contract.call("isKeyGranter", [account: string]): Promise<boolean>',
      stateMutability: "view",
    },
    {
      inputs: [
        {
          type: "address",
          name: "account",
          internalType: "address",
        },
      ],
      outputs: [
        {
          type: "bool",
          name: "",
          internalType: "bool",
        },
      ],
      name: "isLockManager",
      signature:
        'contract.call("isLockManager", [account: string]): Promise<boolean>',
      stateMutability: "view",
    },
    {
      inputs: [
        {
          type: "address",
          name: "account",
          internalType: "address",
        },
      ],
      outputs: [
        {
          type: "bool",
          name: "",
          internalType: "bool",
        },
      ],
      name: "isOwner",
      signature:
        'contract.call("isOwner", [account: string]): Promise<boolean>',
      stateMutability: "view",
    },
    {
      inputs: [
        {
          type: "uint256",
          name: "_tokenId",
          internalType: "uint256",
        },
      ],
      outputs: [
        {
          type: "bool",
          name: "",
          internalType: "bool",
        },
      ],
      name: "isValidKey",
      signature:
        'contract.call("isValidKey", [_tokenId: BigNumberish]): Promise<boolean>',
      stateMutability: "view",
    },
    {
      inputs: [
        {
          type: "uint256",
          name: "_tokenId",
          internalType: "uint256",
        },
      ],
      outputs: [
        {
          type: "uint256",
          name: "",
          internalType: "uint256",
        },
      ],
      name: "keyExpirationTimestampFor",
      signature:
        'contract.call("keyExpirationTimestampFor", [_tokenId: BigNumberish]): Promise<BigNumber>',
      stateMutability: "view",
    },
    {
      inputs: [
        {
          type: "uint256",
          name: "",
          internalType: "uint256",
        },
      ],
      outputs: [
        {
          type: "address",
          name: "",
          internalType: "address",
        },
      ],
      name: "keyManagerOf",
      signature:
        'contract.call("keyManagerOf", [key: BigNumberish]): Promise<string>',
      stateMutability: "view",
    },
    {
      inputs: [],
      outputs: [
        {
          type: "uint256",
          name: "",
          internalType: "uint256",
        },
      ],
      name: "keyPrice",
      signature: 'contract.call("keyPrice"): Promise<BigNumber>',
      stateMutability: "view",
    },
    {
      inputs: [],
      outputs: [
        {
          type: "uint256",
          name: "",
          internalType: "uint256",
        },
      ],
      name: "maxKeysPerAddress",
      signature: 'contract.call("maxKeysPerAddress"): Promise<BigNumber>',
      stateMutability: "view",
    },
    {
      inputs: [],
      outputs: [
        {
          type: "uint256",
          name: "",
          internalType: "uint256",
        },
      ],
      name: "maxNumberOfKeys",
      signature: 'contract.call("maxNumberOfKeys"): Promise<BigNumber>',
      stateMutability: "view",
    },
    {
      inputs: [],
      outputs: [
        {
          type: "string",
          name: "",
          internalType: "string",
        },
      ],
      name: "name",
      signature: 'contract.call("name"): Promise<string>',
      stateMutability: "view",
    },
    {
      inputs: [],
      outputs: [
        {
          type: "uint256",
          name: "",
          internalType: "uint256",
        },
      ],
      name: "numberOfOwners",
      signature: 'contract.call("numberOfOwners"): Promise<BigNumber>',
      stateMutability: "view",
    },
    {
      inputs: [],
      outputs: [
        {
          type: "address",
          name: "",
          internalType: "contract ILockKeyCancelHook",
        },
      ],
      name: "onKeyCancelHook",
      signature: 'contract.call("onKeyCancelHook"): Promise<string>',
      stateMutability: "view",
    },
    {
      inputs: [],
      outputs: [
        {
          type: "address",
          name: "",
          internalType: "contract ILockKeyExtendHook",
        },
      ],
      name: "onKeyExtendHook",
      signature: 'contract.call("onKeyExtendHook"): Promise<string>',
      stateMutability: "view",
    },
    {
      inputs: [],
      outputs: [
        {
          type: "address",
          name: "",
          internalType: "contract ILockKeyGrantHook",
        },
      ],
      name: "onKeyGrantHook",
      signature: 'contract.call("onKeyGrantHook"): Promise<string>',
      stateMutability: "view",
    },
    {
      inputs: [],
      outputs: [
        {
          type: "address",
          name: "",
          internalType: "contract ILockKeyPurchaseHook",
        },
      ],
      name: "onKeyPurchaseHook",
      signature: 'contract.call("onKeyPurchaseHook"): Promise<string>',
      stateMutability: "view",
    },
    {
      inputs: [],
      outputs: [
        {
          type: "address",
          name: "",
          internalType: "contract ILockKeyTransferHook",
        },
      ],
      name: "onKeyTransferHook",
      signature: 'contract.call("onKeyTransferHook"): Promise<string>',
      stateMutability: "view",
    },
    {
      inputs: [],
      outputs: [
        {
          type: "address",
          name: "",
          internalType: "contract ILockTokenURIHook",
        },
      ],
      name: "onTokenURIHook",
      signature: 'contract.call("onTokenURIHook"): Promise<string>',
      stateMutability: "view",
    },
    {
      inputs: [],
      outputs: [
        {
          type: "address",
          name: "",
          internalType: "contract ILockValidKeyHook",
        },
      ],
      name: "onValidKeyHook",
      signature: 'contract.call("onValidKeyHook"): Promise<string>',
      stateMutability: "view",
    },
    {
      inputs: [],
      outputs: [
        {
          type: "address",
          name: "",
          internalType: "address",
        },
      ],
      name: "owner",
      signature: 'contract.call("owner"): Promise<string>',
      stateMutability: "view",
    },
    {
      inputs: [
        {
          type: "uint256",
          name: "_tokenId",
          internalType: "uint256",
        },
      ],
      outputs: [
        {
          type: "address",
          name: "",
          internalType: "address",
        },
      ],
      name: "ownerOf",
      signature:
        'contract.call("ownerOf", [_tokenId: BigNumberish]): Promise<string>',
      stateMutability: "view",
    },
    {
      inputs: [],
      outputs: [
        {
          type: "uint16",
          name: "",
          internalType: "uint16",
        },
      ],
      name: "publicLockVersion",
      signature: 'contract.call("publicLockVersion"): Promise<BigNumber>',
      stateMutability: "pure",
    },
    {
      inputs: [
        {
          type: "address",
          name: "_recipient",
          internalType: "address",
        },
        {
          type: "address",
          name: "_referrer",
          internalType: "address",
        },
        {
          type: "bytes",
          name: "_data",
          internalType: "bytes",
        },
      ],
      outputs: [
        {
          type: "uint256",
          name: "minKeyPrice",
          internalType: "uint256",
        },
      ],
      name: "purchasePriceFor",
      signature:
        'contract.call("purchasePriceFor", [_recipient: string, _referrer: string, _data: BytesLike]): Promise<BigNumber>',
      stateMutability: "view",
    },
    {
      inputs: [
        {
          type: "address",
          name: "",
          internalType: "address",
        },
      ],
      outputs: [
        {
          type: "uint256",
          name: "",
          internalType: "uint256",
        },
      ],
      name: "referrerFees",
      signature:
        'contract.call("referrerFees", [key: string]): Promise<BigNumber>',
      stateMutability: "view",
    },
    {
      inputs: [],
      outputs: [
        {
          type: "uint256",
          name: "",
          internalType: "uint256",
        },
      ],
      name: "refundPenaltyBasisPoints",
      signature:
        'contract.call("refundPenaltyBasisPoints"): Promise<BigNumber>',
      stateMutability: "view",
    },
    {
      inputs: [],
      outputs: [
        {
          type: "uint256",
          name: "",
          internalType: "uint256",
        },
      ],
      name: "schemaVersion",
      signature: 'contract.call("schemaVersion"): Promise<BigNumber>',
      stateMutability: "view",
    },
    {
      inputs: [
        {
          type: "bytes4",
          name: "interfaceId",
          internalType: "bytes4",
        },
      ],
      outputs: [
        {
          type: "bool",
          name: "",
          internalType: "bool",
        },
      ],
      name: "supportsInterface",
      signature:
        'contract.call("supportsInterface", [interfaceId: BytesLike]): Promise<boolean>',
      stateMutability: "view",
    },
    {
      inputs: [],
      outputs: [
        {
          type: "string",
          name: "",
          internalType: "string",
        },
      ],
      name: "symbol",
      signature: 'contract.call("symbol"): Promise<string>',
      stateMutability: "view",
    },
    {
      inputs: [],
      outputs: [
        {
          type: "address",
          name: "",
          internalType: "address",
        },
      ],
      name: "tokenAddress",
      signature: 'contract.call("tokenAddress"): Promise<string>',
      stateMutability: "view",
    },
    {
      inputs: [
        {
          type: "uint256",
          name: "_index",
          internalType: "uint256",
        },
      ],
      outputs: [
        {
          type: "uint256",
          name: "",
          internalType: "uint256",
        },
      ],
      name: "tokenByIndex",
      signature:
        'contract.call("tokenByIndex", [_index: BigNumberish]): Promise<BigNumber>',
      stateMutability: "view",
    },
    {
      inputs: [
        {
          type: "address",
          name: "_keyOwner",
          internalType: "address",
        },
        {
          type: "uint256",
          name: "_index",
          internalType: "uint256",
        },
      ],
      outputs: [
        {
          type: "uint256",
          name: "",
          internalType: "uint256",
        },
      ],
      name: "tokenOfOwnerByIndex",
      signature:
        'contract.call("tokenOfOwnerByIndex", [_keyOwner: string, _index: BigNumberish]): Promise<BigNumber>',
      stateMutability: "view",
    },
    {
      inputs: [
        {
          type: "uint256",
          name: "_tokenId",
          internalType: "uint256",
        },
      ],
      outputs: [
        {
          type: "string",
          name: "",
          internalType: "string",
        },
      ],
      name: "tokenURI",
      signature:
        'contract.call("tokenURI", [_tokenId: BigNumberish]): Promise<string>',
      stateMutability: "view",
    },
    {
      inputs: [
        {
          type: "address",
          name: "_keyOwner",
          internalType: "address",
        },
      ],
      outputs: [
        {
          type: "uint256",
          name: "",
          internalType: "uint256",
        },
      ],
      name: "totalKeys",
      signature:
        'contract.call("totalKeys", [_keyOwner: string]): Promise<BigNumber>',
      stateMutability: "view",
    },
    {
      inputs: [],
      outputs: [
        {
          type: "uint256",
          name: "",
          internalType: "uint256",
        },
      ],
      name: "totalSupply",
      signature: 'contract.call("totalSupply"): Promise<BigNumber>',
      stateMutability: "view",
    },
    {
      inputs: [],
      outputs: [
        {
          type: "uint256",
          name: "",
          internalType: "uint256",
        },
      ],
      name: "transferFeeBasisPoints",
      signature: 'contract.call("transferFeeBasisPoints"): Promise<BigNumber>',
      stateMutability: "view",
    },
    {
      inputs: [],
      outputs: [
        {
          type: "address",
          name: "",
          internalType: "contract IUnlock",
        },
      ],
      name: "unlockProtocol",
      signature: 'contract.call("unlockProtocol"): Promise<string>',
      stateMutability: "view",
    },
  ],
  events: [
    {
      inputs: [
        {
          type: "address",
          name: "owner",
          indexed: true,
          internalType: "address",
        },
        {
          type: "address",
          name: "approved",
          indexed: true,
          internalType: "address",
        },
        {
          type: "uint256",
          name: "tokenId",
          indexed: true,
          internalType: "uint256",
        },
      ],
      outputs: [],
      name: "Approval",
    },
    {
      inputs: [
        {
          type: "address",
          name: "owner",
          indexed: true,
          internalType: "address",
        },
        {
          type: "address",
          name: "operator",
          indexed: true,
          internalType: "address",
        },
        {
          type: "bool",
          name: "approved",
          indexed: false,
          internalType: "bool",
        },
      ],
      outputs: [],
      name: "ApprovalForAll",
    },
    {
      inputs: [
        {
          type: "uint256",
          name: "tokenId",
          indexed: true,
          internalType: "uint256",
        },
        {
          type: "address",
          name: "owner",
          indexed: true,
          internalType: "address",
        },
        {
          type: "address",
          name: "sendTo",
          indexed: true,
          internalType: "address",
        },
        {
          type: "uint256",
          name: "refund",
          indexed: false,
          internalType: "uint256",
        },
      ],
      outputs: [],
      name: "CancelKey",
    },
    {
      inputs: [
        {
          type: "uint256",
          name: "tokenId",
          indexed: true,
          internalType: "uint256",
        },
        {
          type: "uint256",
          name: "newExpiration",
          indexed: false,
          internalType: "uint256",
        },
        {
          type: "uint256",
          name: "amount",
          indexed: false,
          internalType: "uint256",
        },
        {
          type: "bool",
          name: "timeAdded",
          indexed: false,
          internalType: "bool",
        },
      ],
      outputs: [],
      name: "ExpirationChanged",
    },
    {
      inputs: [
        {
          type: "uint256",
          name: "tokenId",
          indexed: true,
          internalType: "uint256",
        },
      ],
      outputs: [],
      name: "ExpireKey",
    },
    {
      inputs: [
        {
          type: "address",
          name: "receiver",
          indexed: true,
          internalType: "address",
        },
        {
          type: "uint256",
          name: "refundedAmount",
          indexed: false,
          internalType: "uint256",
        },
        {
          type: "address",
          name: "tokenAddress",
          indexed: false,
          internalType: "address",
        },
      ],
      outputs: [],
      name: "GasRefunded",
    },
    {
      inputs: [
        {
          type: "uint8",
          name: "version",
          indexed: false,
          internalType: "uint8",
        },
      ],
      outputs: [],
      name: "Initialized",
    },
    {
      inputs: [
        {
          type: "uint256",
          name: "tokenId",
          indexed: true,
          internalType: "uint256",
        },
        {
          type: "uint256",
          name: "newTimestamp",
          indexed: false,
          internalType: "uint256",
        },
      ],
      outputs: [],
      name: "KeyExtended",
    },
    {
      inputs: [
        {
          type: "address",
          name: "account",
          indexed: true,
          internalType: "address",
        },
      ],
      outputs: [],
      name: "KeyGranterAdded",
    },
    {
      inputs: [
        {
          type: "address",
          name: "account",
          indexed: true,
          internalType: "address",
        },
      ],
      outputs: [],
      name: "KeyGranterRemoved",
    },
    {
      inputs: [
        {
          type: "uint256",
          name: "_tokenId",
          indexed: true,
          internalType: "uint256",
        },
        {
          type: "address",
          name: "_newManager",
          indexed: true,
          internalType: "address",
        },
      ],
      outputs: [],
      name: "KeyManagerChanged",
    },
    {
      inputs: [
        {
          type: "uint256",
          name: "updatedRecordsCount",
          indexed: false,
          internalType: "uint256",
        },
      ],
      outputs: [],
      name: "KeysMigrated",
    },
    {
      inputs: [
        {
          type: "uint256",
          name: "expirationDuration",
          indexed: false,
          internalType: "uint256",
        },
        {
          type: "uint256",
          name: "maxNumberOfKeys",
          indexed: false,
          internalType: "uint256",
        },
        {
          type: "uint256",
          name: "maxKeysPerAddress",
          indexed: false,
          internalType: "uint256",
        },
      ],
      outputs: [],
      name: "LockConfig",
    },
    {
      inputs: [
        {
          type: "address",
          name: "account",
          indexed: true,
          internalType: "address",
        },
      ],
      outputs: [],
      name: "LockManagerAdded",
    },
    {
      inputs: [
        {
          type: "address",
          name: "account",
          indexed: true,
          internalType: "address",
        },
      ],
      outputs: [],
      name: "LockManagerRemoved",
    },
    {
      inputs: [
        {
          type: "string",
          name: "name",
          indexed: false,
          internalType: "string",
        },
        {
          type: "string",
          name: "symbol",
          indexed: false,
          internalType: "string",
        },
        {
          type: "string",
          name: "baseTokenURI",
          indexed: false,
          internalType: "string",
        },
      ],
      outputs: [],
      name: "LockMetadata",
    },
    {
      inputs: [
        {
          type: "address",
          name: "previousOwner",
          indexed: false,
          internalType: "address",
        },
        {
          type: "address",
          name: "newOwner",
          indexed: false,
          internalType: "address",
        },
      ],
      outputs: [],
      name: "OwnershipTransferred",
    },
    {
      inputs: [
        {
          type: "uint256",
          name: "oldKeyPrice",
          indexed: false,
          internalType: "uint256",
        },
        {
          type: "uint256",
          name: "keyPrice",
          indexed: false,
          internalType: "uint256",
        },
        {
          type: "address",
          name: "oldTokenAddress",
          indexed: false,
          internalType: "address",
        },
        {
          type: "address",
          name: "tokenAddress",
          indexed: false,
          internalType: "address",
        },
      ],
      outputs: [],
      name: "PricingChanged",
    },
    {
      inputs: [
        {
          type: "uint256",
          name: "freeTrialLength",
          indexed: false,
          internalType: "uint256",
        },
        {
          type: "uint256",
          name: "refundPenaltyBasisPoints",
          indexed: false,
          internalType: "uint256",
        },
      ],
      outputs: [],
      name: "RefundPenaltyChanged",
    },
    {
      inputs: [
        {
          type: "bytes32",
          name: "role",
          indexed: true,
          internalType: "bytes32",
        },
        {
          type: "bytes32",
          name: "previousAdminRole",
          indexed: true,
          internalType: "bytes32",
        },
        {
          type: "bytes32",
          name: "newAdminRole",
          indexed: true,
          internalType: "bytes32",
        },
      ],
      outputs: [],
      name: "RoleAdminChanged",
    },
    {
      inputs: [
        {
          type: "bytes32",
          name: "role",
          indexed: true,
          internalType: "bytes32",
        },
        {
          type: "address",
          name: "account",
          indexed: true,
          internalType: "address",
        },
        {
          type: "address",
          name: "sender",
          indexed: true,
          internalType: "address",
        },
      ],
      outputs: [],
      name: "RoleGranted",
    },
    {
      inputs: [
        {
          type: "bytes32",
          name: "role",
          indexed: true,
          internalType: "bytes32",
        },
        {
          type: "address",
          name: "account",
          indexed: true,
          internalType: "address",
        },
        {
          type: "address",
          name: "sender",
          indexed: true,
          internalType: "address",
        },
      ],
      outputs: [],
      name: "RoleRevoked",
    },
    {
      inputs: [
        {
          type: "address",
          name: "from",
          indexed: true,
          internalType: "address",
        },
        {
          type: "address",
          name: "to",
          indexed: true,
          internalType: "address",
        },
        {
          type: "uint256",
          name: "tokenId",
          indexed: true,
          internalType: "uint256",
        },
      ],
      outputs: [],
      name: "Transfer",
    },
    {
      inputs: [
        {
          type: "uint256",
          name: "transferFeeBasisPoints",
          indexed: false,
          internalType: "uint256",
        },
      ],
      outputs: [],
      name: "TransferFeeChanged",
    },
    {
      inputs: [
        {
          type: "address",
          name: "lockAddress",
          indexed: true,
          internalType: "address",
        },
        {
          type: "address",
          name: "unlockAddress",
          indexed: false,
          internalType: "address",
        },
      ],
      outputs: [],
      name: "UnlockCallFailed",
    },
    {
      inputs: [
        {
          type: "address",
          name: "sender",
          indexed: true,
          internalType: "address",
        },
        {
          type: "address",
          name: "tokenAddress",
          indexed: true,
          internalType: "address",
        },
        {
          type: "address",
          name: "recipient",
          indexed: true,
          internalType: "address",
        },
        {
          type: "uint256",
          name: "amount",
          indexed: false,
          internalType: "uint256",
        },
      ],
      outputs: [],
      name: "Withdrawal",
    },
  ],
};
