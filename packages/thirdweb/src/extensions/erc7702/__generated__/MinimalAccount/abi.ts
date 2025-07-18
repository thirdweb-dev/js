/**
 * Generated ABI for MinimalAccount contract
 * @module MinimalAccount
 */
export const MINIMAL_ACCOUNT_ABI = [
  {
    type: "error",
    name: "AllowanceExceeded",
    inputs: [
      { name: "allowanceUsage", type: "uint256" },
      { name: "limit", type: "uint256" },
      { name: "period", type: "uint64" },
    ],
  },
  {
    type: "error",
    name: "CallPolicyViolated",
    inputs: [
      { name: "target", type: "address" },
      { name: "selector", type: "bytes4" },
    ],
  },
  {
    type: "error",
    name: "CallReverted",
    inputs: [],
  },
  {
    type: "error",
    name: "ConditionFailed",
    inputs: [
      { name: "param", type: "bytes32" },
      { name: "refValue", type: "bytes32" },
      { name: "condition", type: "uint8" },
    ],
  },
  {
    type: "error",
    name: "InvalidDataLength",
    inputs: [
      { name: "actualLength", type: "uint256" },
      { name: "expectedLength", type: "uint256" },
    ],
  },
  {
    type: "error",
    name: "InvalidSignature",
    inputs: [
      { name: "msgSender", type: "address" },
      { name: "thisAddress", type: "address" },
    ],
  },
  {
    type: "error",
    name: "LifetimeUsageExceeded",
    inputs: [
      { name: "lifetimeUsage", type: "uint256" },
      { name: "limit", type: "uint256" },
    ],
  },
  {
    type: "error",
    name: "MaxValueExceeded",
    inputs: [
      { name: "value", type: "uint256" },
      { name: "maxValuePerUse", type: "uint256" },
    ],
  },
  {
    type: "error",
    name: "NoCallsToExecute",
    inputs: [],
  },
  {
    type: "error",
    name: "SessionExpired",
    inputs: [],
  },
  {
    type: "error",
    name: "SessionExpiresTooSoon",
    inputs: [],
  },
  {
    type: "error",
    name: "SessionZeroSigner",
    inputs: [],
  },
  {
    type: "error",
    name: "TransferPolicyViolated",
    inputs: [{ name: "target", type: "address" }],
  },
  {
    type: "error",
    name: "UIDAlreadyProcessed",
    inputs: [],
  },
  {
    type: "event",
    name: "Executed",
    inputs: [
      { name: "to", type: "address", indexed: true },
      { name: "value", type: "uint256" },
      { name: "data", type: "bytes" },
    ],
  },
  {
    type: "event",
    name: "SessionCreated",
    inputs: [
      { name: "signer", type: "address", indexed: true },
      {
        name: "sessionSpec",
        type: "tuple",
        components: [
          { name: "signer", type: "address" },
          { name: "isWildcard", type: "bool" },
          { name: "expiresAt", type: "uint256" },
          {
            name: "callPolicies",
            type: "tuple[]",
            components: [
              { name: "target", type: "address" },
              { name: "selector", type: "bytes4" },
              { name: "maxValuePerUse", type: "uint256" },
              {
                name: "valueLimit",
                type: "tuple",
                components: [
                  { name: "limitType", type: "uint8" },
                  { name: "limit", type: "uint256" },
                  { name: "period", type: "uint256" },
                ],
              },
              {
                name: "constraints",
                type: "tuple[]",
                components: [
                  { name: "condition", type: "uint8" },
                  { name: "index", type: "uint64" },
                  { name: "refValue", type: "bytes32" },
                  {
                    name: "limit",
                    type: "tuple",
                    components: [
                      { name: "limitType", type: "uint8" },
                      { name: "limit", type: "uint256" },
                      { name: "period", type: "uint256" },
                    ],
                  },
                ],
              },
            ],
          },
          {
            name: "transferPolicies",
            type: "tuple[]",
            components: [
              { name: "target", type: "address" },
              { name: "maxValuePerUse", type: "uint256" },
              {
                name: "valueLimit",
                type: "tuple",
                components: [
                  { name: "limitType", type: "uint8" },
                  { name: "limit", type: "uint256" },
                  { name: "period", type: "uint256" },
                ],
              },
            ],
          },
          { name: "uid", type: "bytes32" },
        ],
      },
    ],
  },
  {
    type: "function",
    name: "createSessionWithSig",
    inputs: [
      {
        name: "sessionSpec",
        type: "tuple",
        components: [
          { name: "signer", type: "address" },
          { name: "isWildcard", type: "bool" },
          { name: "expiresAt", type: "uint256" },
          {
            name: "callPolicies",
            type: "tuple[]",
            components: [
              { name: "target", type: "address" },
              { name: "selector", type: "bytes4" },
              { name: "maxValuePerUse", type: "uint256" },
              {
                name: "valueLimit",
                type: "tuple",
                components: [
                  { name: "limitType", type: "uint8" },
                  { name: "limit", type: "uint256" },
                  { name: "period", type: "uint256" },
                ],
              },
              {
                name: "constraints",
                type: "tuple[]",
                components: [
                  { name: "condition", type: "uint8" },
                  { name: "index", type: "uint64" },
                  { name: "refValue", type: "bytes32" },
                  {
                    name: "limit",
                    type: "tuple",
                    components: [
                      { name: "limitType", type: "uint8" },
                      { name: "limit", type: "uint256" },
                      { name: "period", type: "uint256" },
                    ],
                  },
                ],
              },
            ],
          },
          {
            name: "transferPolicies",
            type: "tuple[]",
            components: [
              { name: "target", type: "address" },
              { name: "maxValuePerUse", type: "uint256" },
              {
                name: "valueLimit",
                type: "tuple",
                components: [
                  { name: "limitType", type: "uint8" },
                  { name: "limit", type: "uint256" },
                  { name: "period", type: "uint256" },
                ],
              },
            ],
          },
          { name: "uid", type: "bytes32" },
        ],
      },
      { name: "signature", type: "bytes" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "eip712Domain",
    inputs: [],
    outputs: [
      { name: "fields", type: "bytes1" },
      { name: "name", type: "string" },
      { name: "version", type: "string" },
      { name: "chainId", type: "uint256" },
      { name: "verifyingContract", type: "address" },
      { name: "salt", type: "bytes32" },
      { name: "extensions", type: "uint256[]" },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "execute",
    inputs: [
      {
        name: "calls",
        type: "tuple[]",
        components: [
          { name: "target", type: "address" },
          { name: "value", type: "uint256" },
          { name: "data", type: "bytes" },
        ],
      },
    ],
    outputs: [],
    stateMutability: "payable",
  },
  {
    type: "function",
    name: "executeWithSig",
    inputs: [
      {
        name: "wrappedCalls",
        type: "tuple",
        components: [
          {
            name: "calls",
            type: "tuple[]",
            components: [
              { name: "target", type: "address" },
              { name: "value", type: "uint256" },
              { name: "data", type: "bytes" },
            ],
          },
          { name: "uid", type: "bytes32" },
        ],
      },
      { name: "signature", type: "bytes" },
    ],
    outputs: [],
    stateMutability: "payable",
  },
  {
    type: "function",
    name: "getCallPoliciesForSigner",
    inputs: [{ name: "signer", type: "address" }],
    outputs: [
      {
        name: "",
        type: "tuple[]",
        components: [
          { name: "target", type: "address" },
          { name: "selector", type: "bytes4" },
          { name: "maxValuePerUse", type: "uint256" },
          {
            name: "valueLimit",
            type: "tuple",
            components: [
              { name: "limitType", type: "uint8" },
              { name: "limit", type: "uint256" },
              { name: "period", type: "uint256" },
            ],
          },
          {
            name: "constraints",
            type: "tuple[]",
            components: [
              { name: "condition", type: "uint8" },
              { name: "index", type: "uint64" },
              { name: "refValue", type: "bytes32" },
              {
                name: "limit",
                type: "tuple",
                components: [
                  { name: "limitType", type: "uint8" },
                  { name: "limit", type: "uint256" },
                  { name: "period", type: "uint256" },
                ],
              },
            ],
          },
        ],
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getSessionExpirationForSigner",
    inputs: [{ name: "signer", type: "address" }],
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getSessionStateForSigner",
    inputs: [{ name: "signer", type: "address" }],
    outputs: [
      {
        name: "",
        type: "tuple",
        components: [
          {
            name: "transferValue",
            type: "tuple[]",
            components: [
              { name: "remaining", type: "uint256" },
              { name: "target", type: "address" },
              { name: "selector", type: "bytes4" },
              { name: "index", type: "uint256" },
            ],
          },
          {
            name: "callValue",
            type: "tuple[]",
            components: [
              { name: "remaining", type: "uint256" },
              { name: "target", type: "address" },
              { name: "selector", type: "bytes4" },
              { name: "index", type: "uint256" },
            ],
          },
          {
            name: "callParams",
            type: "tuple[]",
            components: [
              { name: "remaining", type: "uint256" },
              { name: "target", type: "address" },
              { name: "selector", type: "bytes4" },
              { name: "index", type: "uint256" },
            ],
          },
        ],
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getTransferPoliciesForSigner",
    inputs: [{ name: "signer", type: "address" }],
    outputs: [
      {
        name: "",
        type: "tuple[]",
        components: [
          { name: "target", type: "address" },
          { name: "maxValuePerUse", type: "uint256" },
          {
            name: "valueLimit",
            type: "tuple",
            components: [
              { name: "limitType", type: "uint8" },
              { name: "limit", type: "uint256" },
              { name: "period", type: "uint256" },
            ],
          },
        ],
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "isWildcardSigner",
    inputs: [{ name: "signer", type: "address" }],
    outputs: [{ name: "", type: "bool" }],
    stateMutability: "view",
  },
] as const;
