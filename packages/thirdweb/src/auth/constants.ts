export const ERC_6492_MAGIC_VALUE =
  "0x6492649264926492649264926492649264926492649264926492649264926492" as const;

// returns either 0x1 (valid) or 0x0 (invalid)
export const universalSignatureValidatorAbi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "_signer",
        type: "address",
      },
      {
        internalType: "bytes32",
        name: "_hash",
        type: "bytes32",
      },
      {
        internalType: "bytes",
        name: "_signature",
        type: "bytes",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
] as const;
