'use client'

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { CircleCheckBigIcon } from "lucide-react"

type CoreContract = {
  name: string;
  description: string;
  constructorParams: Array<{
    name: string;
    type: string;
  }>;
  supportedCallbacks: Array<string>;
  supportedInterfaces: Array<{
    name: string;
    id: string;
  }>;
}

type ModularContract = {
  name: string;
  description: string;
  constructorParams: Array<{
    name: string;
    type: string;
  }>;
  requiredInterfaces: Array<{
    name: string;
    id: string;
  }>;
  supportedInterfaces: Array<{
    name: string;
    id: string;
  }>;
  callbackFunctions: Array<string>;
  fallbackFunctions: Array<{
    name: string;
    params: Array<{
      name: string;
      type: string;
    }>;
  }>;
};

const coreContracts: CoreContract[] = [
  {
    name: "ERC-721 Core",
    description: "The ERC-20 core contract is the foundation for an ERC-721 NFT smart contract",
    constructorParams: [
      {
        name: "_name",
        type: "string",
      },
      {
        name: "_symbol",
        type: "string",
      },
      {
        name: "_contractURI",
        type: "string",
      },
      {
        name: "_symbol",
        type: "string",
      },
    ],
    supportedCallbacks: [
      "beforeMintERC721",
      "beforeTransferERC721",
      "beforeBurnERC721",
      "beforeApproveERC721",
      "beforeApproveForAll",
      "onTokenURI"
    ],
    supportedInterfaces: [
      { name: "ERC-165", id: "0x01ffc9a7" },
      { name: "ERC-721", id: "0x80ac58cd" },
      { name: "ERC-721Metadata", id: "0x5b5e139f" },
      { name: "ERC-7572", id: "0xe8a3d485" },
      { name: "ERC-173", id: "0x7f5828d0" }
    ]
  },
  {
    name: "ERC-20 Core",
    description: "The ERC-20 core contract is the foundation for an ERC-20 token smart contract",
    constructorParams: [
      {
        name: "_name",
        type: "string",
      },
      {
        name: "_symbol",
        type: "string",
      },
      {
        name: "_contractURI",
        type: "string",
      },
      {
        name: "_owner",
        type: "address",
      },
      {
        name: "_extensions",
        type: "address[]",
      },
      {
        name: "_extensionInstallData",
        type: "bytes[]",
      }
    ],
    supportedCallbacks: [
      "beforeMintERC20",
      "beforeTransferERC20",
      "beforeBurnERC20",
      "beforeApproveERC20"
    ],
    supportedInterfaces: [
      { name: "ERC-165", id: "0x01ffc9a7" },
      { name: "ERC-7572", id: "0xe8a3d485" },
      { name: "ERC-173", id: "0x7f5828d0" },
      { name: "IERC20", id: "0x36372b07" }
    ]
  },
  {
    name: "ERC-1155 Core",
    description: "The ERC-1155 core contract is the foundation for an ERC-1155 token smart contract",
    constructorParams: [
      {
        name: "_name",
        type: "string"
      },
      {
        name: "_symbol",
        type: "string"
      },
      {
        name: "_contractURI",
        type: "string"
      },
      {
        name: "_owner",
        type: "address"
      },
      {
        name: "_extensions",
        type: "address[]"
      },
      {
        name: "_extensionInstallData",
        type: "bytes[]"
      }
    ],
    supportedCallbacks: [
      "beforeMintERC1155",
      "beforeTransferERC1155",
      "beforeBatchTransferERC1155",
      "beforeBurnERC1155",
      "beforeApproveForAll",
      "onTokenURI",
      "beforeBatchMintERC1155"
    ],
    supportedInterfaces: [
      { name: "ERC-165", id: "0x01ffc9a7" },
      { name: "ERC-1155", id: "0xd9b67a26" },
      { name: "ERC-1155MetadataURI", id: "0x0e89341c" },
      { name: "ERC-7572", id: "0xe8a3d485" },
      { name: "ERC-173", id: "0x7f5828d0" }
    ]
  }
]

const modularContracts: ModularContract[] = [
  {
    name: "BatchMetadata",
    description: "The BatchMetadata contract is a module that allows you to batch mint NFTs with metadata",
    constructorParams: [],
    requiredInterfaces: [
      { name: "ERC-721", id: "0x80ac58cd" }
    ],
    supportedInterfaces: [
      { name: "ERC-4906", id: "0x49064906" }
    ],
    callbackFunctions: [
      "onTokenURI",
    ],
    fallbackFunctions: [
      {
        name: "getExtensionConfig",
        params: []
      },
      {
        name: "getAllMetadataBatches",
        params: []
      },
      {
        name: "uploadMetadata",
        params: [
          { name: "_amount", type: "uint256" },
          { name: "_baseURI", type: "string" }
        ]
      }
    ]
  },
  {
    name: "BatchMetadata",
    description: "The BatchMetadataERC1155 contract is a module that allows you to batch mint ERC-1155 tokens with metadata",
    constructorParams: [],
    requiredInterfaces: [
      { name: "ERC-1155", id: "0xd9b67a26" }
    ],
    supportedInterfaces: [
      { name: "ERC-4906", id: "0x49064906" }
    ],
    callbackFunctions: [
      "onTokenURI",
    ],
    fallbackFunctions: [
      {
        name: "getExtensionConfig",
        params: []
      },
      {
        name: "getAllMetadataBatches",
        params: []
      },
      {
        name: "uploadMetadata",
        params: [
          { name: "_amount", type: "uint256" },
          { name: "_baseURI", type: "string" }
        ]
      }
    ]
  },
  {
    name: "DelayedRevealBatchMetadata",
    description: "The DelayedRevealBatchMetadata contract is a module that allows you to upload and reveal batch metadata for NFTs with delayed reveal functionality",
    constructorParams: [],
    requiredInterfaces: [
      { name: "ERC-721", id: "0x80ac58cd" }
    ],
    supportedInterfaces: [
      { name: "ERC-4906", id: "0x49064906" }
    ],
    callbackFunctions: [
      "onTokenURI",
    ],
    fallbackFunctions: [
      {
        name: "getExtensionConfig",
        params: []
      },
      {
        name: "getAllMetadataBatches",
        params: []
      },
      {
        name: "uploadMetadata",
        params: [
          { name: "_amount", type: "uint256" },
          { name: "_baseURI", type: "string" },
          { name: "_data", type: "bytes" }
        ]
      },
      {
        name: "reveal",
        params: [
          { name: "_index", type: "uint256" },
          { name: "_key", type: "bytes" }
        ]
      }
    ]
  },
  {
    name: "OpenEditionMetadata",
    description: "The OpenEditionMetadata contract is a module that provides shared metadata for all ERC-721 tokens in the collection",
    constructorParams: [],
    requiredInterfaces: [
      { name: "ERC-721", id: "0x80ac58cd" }
    ],
    supportedInterfaces: [
      { name: "ERC-4906", id: "0x49064906" }
    ],
    callbackFunctions: [
      "onTokenURI"
    ],
    fallbackFunctions: [
      {
        name: "getExtensionConfig",
        params: []
      },
      {
        name: "setSharedMetadata",
        params: [
          {
            name: "_metadata",
            type: "SharedMetadata"
          }
        ]
      }
    ]
  },
  {
    name: "OpenEditionMetadata",
    description: "The OpenEditionMetadata contract is a module that provides shared metadata for all ERC-1155 tokens in the collection",
    constructorParams: [],
    requiredInterfaces: [
      { name: "ERC-1155", id: "0xd9b67a26" }
    ],
    supportedInterfaces: [
      { name: "ERC-4906", id: "0x49064906" }
    ],
    callbackFunctions: [
      "onTokenURI"
    ],
    fallbackFunctions: [
      {
        name: "getExtensionConfig",
        params: []
      },
      {
        name: "setSharedMetadata",
        params: [
          {
            name: "_metadata",
            type: "SharedMetadata"
          }
        ]
      }
    ]
  },
  {
    name: "SimpleMetadata",
    description: "The SimpleMetadata contract is a module that allows setting simple metadata URIs for individual ERC-721 tokens",
    constructorParams: [],
    requiredInterfaces: [
      { name: "ERC-721", id: "0x80ac58cd" }
    ],
    supportedInterfaces: [
      { name: "ERC-4906", id: "0x49064906" }
    ],
    callbackFunctions: [
      "onTokenURI"
    ],
    fallbackFunctions: [
      {
        name: "getExtensionConfig",
        params: []
      },
      {
        name: "setTokenURI",
        params: [
          { name: "_id", type: "uint256" },
          { name: "_uri", type: "string" }
        ]
      }
    ]
  },
  {
    name: "SimpleMetadata",
    description: "The SimpleMetadata contract is a module that allows setting simple metadata URIs for individual ERC-1155 tokens",
    constructorParams: [],
    requiredInterfaces: [
      { name: "ERC-1155", id: "0xd9b67a26" }
    ],
    supportedInterfaces: [
      { name: "ERC-4906", id: "0x49064906" }
    ],
    callbackFunctions: [
      "onTokenURI"
    ],
    fallbackFunctions: [
      {
        name: "getExtensionConfig",
        params: []
      },
      {
        name: "setTokenURI",
        params: [
          { name: "_id", type: "uint256" },
          { name: "_uri", type: "string" }
        ]
      }
    ]
  },
  {
    name: "ClaimableERC20",
    description: "The ClaimableERC20 contract is a module that enables claimable minting with various claim conditions for ERC-20 tokens",
    constructorParams: [{
      name: "primarySaleRecipient",
      type: "address"
    }],
    supportedInterfaces: [],
    requiredInterfaces: [
      { name: "ERC-20", id: "0x36372b07" }
    ],
    callbackFunctions: [
      "beforeMintERC20"
    ],
    fallbackFunctions: [
      {
        name: "getExtensionConfig",
        params: []
      },
      {
        name: "getSaleConfig",
        params: []
      },
      {
        name: "setSaleConfig",
        params: [
          { name: "_primarySaleRecipient", type: "address" }
        ]
      },
      {
        name: "getClaimCondition",
        params: []
      },
      {
        name: "setClaimCondition",
        params: [
          {
            name: "_claimCondition",
            type: "ClaimableERC20.ClaimCondition"
          }
        ]
      },
      {
        name: "eip712Domain",
        params: []
      }
    ]
  },
  {
    name: "ClaimableERC721",
    description: "The ClaimableERC721 contract is a module that enables claimable minting with various claim conditions for ERC-721 tokens",
    constructorParams: [{
      name: "primarySaleRecipient",
      type: "address"
    }],
    supportedInterfaces: [],
    requiredInterfaces: [
      { name: "ERC-721", id: "0x80ac58cd" }
    ],
    callbackFunctions: [
      "beforeMintERC721"
    ],
    fallbackFunctions: [
      {
        name: "getExtensionConfig",
        params: []
      },
      {
        name: "getSaleConfig",
        params: []
      },
      {
        name: "setSaleConfig",
        params: [
          { name: "_primarySaleRecipient", type: "address" }
        ]
      },
      {
        name: "getClaimCondition",
        params: []
      },
      {
        name: "setClaimCondition",
        params: [
          {
            name: "_claimCondition",
            type: "ClaimableERC721.ClaimCondition"
          }
        ]
      },
      {
        name: "eip712Domain",
        params: []
      }
    ]
  },
  {
    name: "MintableERC1155",
    description: "The MintableERC1155 contract is a module that enables minting of ERC-1155 tokens with various configurations",
    constructorParams: [{
      name: "primarySaleRecipient",
      type: "address"
    }],
    requiredInterfaces: [
      { name: "ERC-1155", id: "0xd9b67a26" }
    ],
    supportedInterfaces: [
      { name: "ERC-4906", id: "0x49064906" }
    ],
    callbackFunctions: [
      "beforeMintERC1155",
      "onTokenURI"
    ],
    fallbackFunctions: [
      {
        name: "getExtensionConfig",
        params: []
      },
      {
        name: "getSaleConfig",
        params: []
      },
      {
        name: "setSaleConfig",
        params: [
          { name: "_primarySaleRecipient", type: "address" }
        ]
      },
      {
        name: "setTokenURI",
        params: [
          { name: "_tokenId", type: "uint256" },
          { name: "_tokenURI", type: "string" }
        ]
      },
      {
        name: "eip712Domain",
        params: []
      }
    ]
  },
  {
    name: "ClaimableERC1155",
    description: "The ClaimableERC1155 contract is a module that enables claimable minting with various claim conditions for ERC-1155 tokens",
    constructorParams: [{
      name: "primarySaleRecipient",
      type: "address"
    }],
    supportedInterfaces: [],
    requiredInterfaces: [
      { name: "ERC-1155", id: "0xd9b67a26" }
    ],
    callbackFunctions: [
      "beforeMintERC1155"
    ],
    fallbackFunctions: [
      {
        name: "getExtensionConfig",
        params: []
      },
      {
        name: "getSaleConfig",
        params: []
      },
      {
        name: "setSaleConfig",
        params: [
          { name: "_primarySaleRecipient", type: "address" }
        ]
      },
      {
        name: "getClaimConditionByTokenId",
        params: [
          { name: "_id", type: "uint256" }
        ]
      },
      {
        name: "setClaimConditionByTokenId",
        params: [
          { name: "_id", type: "uint256" },
          { name: "_claimCondition", type: "ClaimableERC1155.ClaimCondition" }
        ]
      },
      {
        name: "eip712Domain",
        params: []
      }
    ]
  },
  {
    name: "MintableERC20",
    description: "The MintableERC20 contract is a module that enables minting of ERC-20 tokens with various configurations",
    supportedInterfaces: [],
    constructorParams: [{
      name: "primarySaleRecipient",
      type: "address"
    }],
    requiredInterfaces: [
      { name: "ERC-20", id: "0x36372b07" }
    ],
    callbackFunctions: [
      "beforeMintERC20"
    ],
    fallbackFunctions: [
      {
        name: "getExtensionConfig",
        params: []
      },
      {
        name: "getSaleConfig",
        params: []
      },
      {
        name: "setSaleConfig",
        params: [
          { name: "_primarySaleRecipient", type: "address" }
        ]
      },
      {
        name: "eip712Domain",
        params: []
      }
    ]
  },
  {
    name: "MintableERC721",
    description: "The MintableERC721 contract is a module that enables minting of ERC-721 tokens with various configurations",
    constructorParams: [{
      name: "primarySaleRecipient",
      type: "address"
    }],
    requiredInterfaces: [
      { name: "ERC-721", id: "0x80ac58cd" }
    ],
    supportedInterfaces: [
      { name: "ERC-4906", id: "0x49064906" }
    ],
    callbackFunctions: [
      "beforeMintERC721",
      "onTokenURI"
    ],
    fallbackFunctions: [
      {
        name: "getExtensionConfig",
        params: []
      },
      {
        name: "getSaleConfig",
        params: []
      },
      {
        name: "setSaleConfig",
        params: [
          { name: "_primarySaleRecipient", type: "address" }
        ]
      },
      {
        name: "getAllMetadataBatches",
        params: []
      },
      {
        name: "eip712Domain",
        params: []
      }
    ]
  },
  {
    name: "RoyaltyERC721",
    description: "The RoyaltyERC721 contract is a module that provides royalty configuration and distribution for ERC-721 tokens",
    constructorParams: [],
    requiredInterfaces: [
      { name: "ERC-721", id: "0x80ac58cd" }
    ],
    supportedInterfaces: [
      { name: "IERC2981", id: "0x2a55205a" }
    ],
    callbackFunctions: [],
    fallbackFunctions: [
      {
        name: "getExtensionConfig",
        params: []
      },
      {
        name: "royaltyInfo",
        params: [
          { name: "_tokenId", type: "uint256" },
          { name: "_salePrice", type: "uint256" }
        ]
      },
      {
        name: "getDefaultRoyaltyInfo",
        params: []
      },
      {
        name: "getRoyaltyInfoForToken",
        params: [
          { name: "_tokenId", type: "uint256" }
        ]
      },
      {
        name: "setDefaultRoyaltyInfo",
        params: [
          { name: "_royaltyRecipient", type: "address" },
          { name: "_royaltyBps", type: "uint256" }
        ]
      },
      {
        name: "setRoyaltyInfoForToken",
        params: [
          { name: "_tokenId", type: "uint256" },
          { name: "_recipient", type: "address" },
          { name: "_bps", type: "uint256" }
        ]
      }
    ]
  },
  {
    name: "RoyaltyERC1155",
    description: "The RoyaltyERC1155 contract is a module that provides royalty configuration and distribution for ERC-1155 tokens",
    constructorParams: [],
    requiredInterfaces: [
      { name: "ERC-1155", id: "0xd9b67a26" }
    ],
    supportedInterfaces: [
      { name: "IERC2981", id: "0x2a55205a" }
    ],
    callbackFunctions: [],
    fallbackFunctions: [
      {
        name: "getExtensionConfig",
        params: []
      },
      {
        name: "royaltyInfo",
        params: [
          { name: "_tokenId", type: "uint256" },
          { name: "_salePrice", type: "uint256" }
        ]
      },
      {
        name: "getDefaultRoyaltyInfo",
        params: []
      },
      {
        name: "getRoyaltyInfoForToken",
        params: [
          { name: "_tokenId", type: "uint256" }
        ]
      },
      {
        name: "setDefaultRoyaltyInfo",
        params: [
          { name: "_royaltyRecipient", type: "address" },
          { name: "_royaltyBps", type: "uint256" }
        ]
      },
      {
        name: "setRoyaltyInfoForToken",
        params: [
          { name: "_tokenId", type: "uint256" },
          { name: "_recipient", type: "address" },
          { name: "_bps", type: "uint256" }
        ]
      }
    ]
  },
  {
    name: "TransferableERC20",
    description: "The TransferableERC20 contract is a module that allows enabling and disabling transfers for ERC-20 tokens",
    constructorParams: [],
    requiredInterfaces: [],
    supportedInterfaces: [],
    callbackFunctions: [
      "beforeTransferERC20"
    ],
    fallbackFunctions: [
      {
        name: "getExtensionConfig",
        params: []
      },
      {
        name: "isTransferEnabled",
        params: []
      },
      {
        name: "isTransferEnabledFor",
        params: [
          { name: "target", type: "address" }
        ]
      },
      {
        name: "setTransferable",
        params: [
          { name: "enableTransfer", type: "bool" }
        ]
      },
      {
        name: "setTransferableFor",
        params: [
          { name: "target", type: "address" },
          { name: "enableTransfer", type: "bool" }
        ]
      }
    ]
  },
  {
    name: "TransferableERC721",
    description: "The TransferableERC721 contract is a module that allows enabling and disabling transfers for ERC-721 tokens",
    constructorParams: [],
    requiredInterfaces: [
      { name: "ERC-721", id: "0x80ac58cd" }
    ],
    supportedInterfaces: [],
    callbackFunctions: [
      "beforeTransferERC721"
    ],
    fallbackFunctions: [
      {
        name: "getExtensionConfig",
        params: []
      },
      {
        name: "isTransferEnabled",
        params: []
      },
      {
        name: "isTransferEnabledFor",
        params: [
          { name: "target", type: "address" }
        ]
      },
      {
        name: "setTransferable",
        params: [
          { name: "enableTransfer", type: "bool" }
        ]
      },
      {
        name: "setTransferableFor",
        params: [
          { name: "target", type: "address" },
          { name: "enableTransfer", type: "bool" }
        ]
      }
    ]
  },
  {
    name: "TransferableERC1155",
    description: "The TransferableERC1155 contract is a module that allows enabling and disabling transfers for ERC-1155 tokens",
    constructorParams: [],
    requiredInterfaces: [
      { name: "ERC-1155", id: "0xd9b67a26" }
    ],
    supportedInterfaces: [],
    callbackFunctions: [
      "beforeTransferERC1155",
      "beforeBatchTransferERC1155"
    ],
    fallbackFunctions: [
      {
        name: "getExtensionConfig",
        params: []
      },
      {
        name: "isTransferEnabled",
        params: []
      },
      {
        name: "isTransferEnabledFor",
        params: [
          { name: "target", type: "address" }
        ]
      },
      {
        name: "setTransferable",
        params: [
          { name: "enableTransfer", type: "bool" }
        ]
      },
      {
        name: "setTransferableFor",
        params: [
          { name: "target", type: "address" },
          { name: "enableTransfer", type: "bool" }
        ]
      }
    ]
  }
]

const DeployDialog = ({ children }: { children: React.ReactNode }) => {
  const [step, setStep] = useState<number>(0)

  const SelectChain = () => (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Select Chain</DialogTitle>
      </DialogHeader>
      <DialogDescription>
        Select the chain you want to deploy on.
      </DialogDescription>

      <div className="flex-grow flex flex-col gap-4 justify-center items-center">
        <Select >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select Chain" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="sepolia">Sepolia Testnet</SelectItem>
          </SelectContent>
        </Select>

        <Button variant="outline" className="w-[180px]" onClick={() => setStep(1)}>
          Deploy
        </Button>
      </div>
    </DialogContent>
  )

  const Loading = () => {
    useEffect(() => {
      const timer = setTimeout(() => {
        setStep(2)
      }, 3000)

      return () => clearTimeout(timer)
    }, [])

    return (
      <DialogContent className="flex flex-col">
        <DialogHeader>
          <DialogTitle>Deploying...</DialogTitle>
        </DialogHeader>
        <div role="status" className="self-center">
          <svg aria-hidden="true" className="w-[225px] h-[225px] text-gray-200 animate-spin dark:text-gray-600 fill-blue-600 self-center" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
          </svg>
        </div>
      </DialogContent>
    )
  }

  const Success = () => (
    <DialogContent className="flex flex-col">
      <DialogHeader>
        <DialogTitle>Success!</DialogTitle>
      </DialogHeader>
      <CircleCheckBigIcon className="w-[225px] h-[225px] text-green-500 self-center" />
    </DialogContent >
  )

  const steps = [
    <SelectChain />,
    <Loading />,
    <Success />
  ]

  return (
    <Dialog>
      <DialogTrigger>{children}</DialogTrigger>
      {steps[step]}
    </Dialog>
  )
}

export default function Page() {
  const [selectedCoreContract, setSelectedCoreContract] = useState<CoreContract | null>(null);
  const [selectedModularContracts, setSelectedModularContracts] = useState<ModularContract[]>([]);

  const callbacksUsed = [...new Set(selectedModularContracts
    .map(c => c.callbackFunctions)
    .flat())]
  const supportsAllCallbacks = (contract: ModularContract) => {
    const callbackFunctionsSupported = contract.callbackFunctions
      .filter(callbackFunction => selectedCoreContract?.supportedCallbacks.includes(callbackFunction))

    return callbackFunctionsSupported.length === contract.callbackFunctions.length
  }

  const callbackAlreadyUsed = (contract: ModularContract) => {
    return contract.callbackFunctions
      .filter(callbackFunction => callbacksUsed.includes(callbackFunction)).length !== 0
  }

  return (
    <section className="flex flex-col h-full gap-8">
      <header className="flex justify-between items-center p-6">
        <h1 className="text-4xl font-bold">Contract Wizard</h1>
        <DeployDialog>
          <Button variant="outline" className="text-sm" disabled={!selectedCoreContract}>
            Deploy
          </Button>
        </DeployDialog>
      </header>

      <div className="flex-grow grid grid-cols-4 gap-4">

        <Card className="grid-flow-col flex flex-col border border-border rounded-lg p-3">
          <CardTitle className="text-lg font-semibold">
            Fallback Functions
          </CardTitle>

          {selectedModularContracts
            .map(contract => contract.fallbackFunctions)
            .flat()
            .map(fallbackFunction => (
              <p>{fallbackFunction.name}</p>
            ))
          }
        </Card>

        <Card className="grid-flow-col flex flex-col border border-border rounded-lg p-3">
          <CardTitle className="text-lg font-semibold">
            Contracts
          </CardTitle>

          <div className="flex-grow flex flex-col justify-end gap-2">
            {selectedModularContracts.map((contract) => (
              <Button
                className="flex flex-col gap-2 hover:bg-red-300"
                size="sm"
                key={contract.name}
                onClick={() => setSelectedModularContracts(prev => prev.filter(c => c.name !== contract.name))}
              >
                {contract.name}
              </Button>
            ))}
            {selectedCoreContract && (
              <Button
                className="flex flex-col gap-2 hover:bg-red-300"
                size="sm"
                key={selectedCoreContract.name}
                onClick={() => setSelectedCoreContract(null)}
              >
                {selectedCoreContract.name}
              </Button>
            )}
          </div>
        </Card>
        <Card className="grid-flow-col flex flex-col border border-border rounded-lg p-3">
          <CardTitle className="text-lg font-semibold">
            Callback Functions
          </CardTitle>

          {selectedCoreContract?.supportedCallbacks.map(callbackFunction => (
            <p className={callbacksUsed.includes(callbackFunction) ? 'text-slate-500' : ""}>
              {callbackFunction}
            </p>
          ))}
        </Card>

        <Card className="flex flex-col border border-border rounded-lg p-3 gap-2 overflow-auto max-h-[65vh]">
          <CardTitle className="text-lg font-semibold">
            {selectedCoreContract ? "Modular Contracts" : "Core Contracts"}
          </CardTitle>

          {selectedCoreContract
            ? modularContracts
              // check if the core contract has all the required interfaces
              .filter(contract => contract.requiredInterfaces.some(cinterface => selectedCoreContract.supportedInterfaces.some(_cinterface => _cinterface.id === cinterface.id)))
              // check if the core contract supports all the callback functions
              .filter(contract => supportsAllCallbacks(contract))
              // check if the modular contract has already been selected
              .filter(contract => !selectedModularContracts.some(_contract => _contract.name === contract.name))
              .map((contract) => (
                <Button
                  className="flex flex-col gap-2 min-h-9"
                  size="sm"
                  key={contract.name}
                  onClick={() => setSelectedModularContracts(prev => [contract, ...prev])}
                  disabled={callbackAlreadyUsed(contract)}
                >
                  {contract.name}
                </Button>
              ))
            : coreContracts.map((contract) => (
              <Button className="flex flex-col gap-2" size="sm" key={contract.name} onClick={() => setSelectedCoreContract(contract)}>
                {contract.name}
              </Button>
            ))}
        </Card>
      </div>
    </section >
  )
}
