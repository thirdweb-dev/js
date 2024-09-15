import { describe, expect, it } from "vitest";
import { FORKED_POLYGON_CHAIN } from "../../../../test/src/chains.js";
import { TEST_CLIENT } from "../../../../test/src/test-clients.js";
import { TEST_ACCOUNT_A } from "../../../../test/src/test-wallets.js";
import { getContract } from "../../../contract/contract.js";
import { CONTRACT_PUBLISHER_ADDRESS } from "../../../contract/deployment/publisher.js";
import { parseEventLogs } from "../../../event/actions/parse-logs.js";
import { sendAndConfirmTransaction } from "../../../transaction/actions/send-and-confirm-transaction.js";
import { fetchDeployMetadata } from "../../../utils/any-evm/deploy-metadata.js";
import { contractPublishedEvent } from "../__generated__/IContractPublisher/events/ContractPublished.js";
import { publishContract } from "./publish.js";

describe.runIf(process.env.TW_SECRET_KEY)("publishContract", () => {
  it("should publish a contract successfully", async () => {
    const publisherContract = getContract({
      client: TEST_CLIENT,
      chain: FORKED_POLYGON_CHAIN,
      address: CONTRACT_PUBLISHER_ADDRESS,
    });

    const catAttackDeployMetadata = await fetchDeployMetadata({
      client: TEST_CLIENT,
      uri: "ipfs://QmWcAMvBy49WRrzZeK4EQeVnkdmyb5H4STz4gUQwnt1kzC",
    });

    const tx = publishContract({
      contract: publisherContract,
      account: TEST_ACCOUNT_A,
      metadata: {
        ...catAttackDeployMetadata,
        version: "0.0.1",
        description: "Cat Attack NFT",
        changelog: "Initial release",
      },
    });
    const result = await sendAndConfirmTransaction({
      transaction: tx,
      account: TEST_ACCOUNT_A,
    });
    expect(result.transactionHash.length).toBeGreaterThan(0);
    const logs = parseEventLogs({
      events: [contractPublishedEvent()],
      logs: result.logs,
    });
    expect(logs?.[0]?.args.publishedContract.contractId).toBe("CatAttackNFT");
    expect(logs?.[0]?.args.publishedContract.publishMetadataUri).toBeDefined();
    const publishedData = await fetchDeployMetadata({
      client: TEST_CLIENT,
      uri: logs?.[0]?.args.publishedContract.publishMetadataUri ?? "",
    });
    expect(publishedData).toMatchInlineSnapshot(`
      {
        "abi": [
          {
            "inputs": [
              {
                "internalType": "string",
                "name": "_name",
                "type": "string",
              },
              {
                "internalType": "string",
                "name": "_symbol",
                "type": "string",
              },
            ],
            "stateMutability": "nonpayable",
            "type": "constructor",
          },
          {
            "inputs": [
              {
                "internalType": "uint256",
                "name": "index",
                "type": "uint256",
              },
            ],
            "name": "BatchMintInvalidBatchId",
            "type": "error",
          },
          {
            "inputs": [
              {
                "internalType": "uint256",
                "name": "tokenId",
                "type": "uint256",
              },
            ],
            "name": "BatchMintInvalidTokenId",
            "type": "error",
          },
          {
            "inputs": [
              {
                "internalType": "uint256",
                "name": "batchId",
                "type": "uint256",
              },
            ],
            "name": "BatchMintMetadataFrozen",
            "type": "error",
          },
          {
            "inputs": [],
            "name": "ContractMetadataUnauthorized",
            "type": "error",
          },
          {
            "inputs": [],
            "name": "LazyMintInvalidAmount",
            "type": "error",
          },
          {
            "inputs": [],
            "name": "LazyMintUnauthorized",
            "type": "error",
          },
          {
            "inputs": [],
            "name": "OwnableUnauthorized",
            "type": "error",
          },
          {
            "inputs": [
              {
                "internalType": "uint256",
                "name": "max",
                "type": "uint256",
              },
              {
                "internalType": "uint256",
                "name": "actual",
                "type": "uint256",
              },
            ],
            "name": "RoyaltyExceededMaxFeeBps",
            "type": "error",
          },
          {
            "inputs": [
              {
                "internalType": "address",
                "name": "recipient",
                "type": "address",
              },
            ],
            "name": "RoyaltyInvalidRecipient",
            "type": "error",
          },
          {
            "inputs": [],
            "name": "RoyaltyUnauthorized",
            "type": "error",
          },
          {
            "anonymous": false,
            "inputs": [
              {
                "indexed": true,
                "internalType": "address",
                "name": "_owner",
                "type": "address",
              },
              {
                "indexed": true,
                "internalType": "address",
                "name": "_operator",
                "type": "address",
              },
              {
                "indexed": false,
                "internalType": "bool",
                "name": "_approved",
                "type": "bool",
              },
            ],
            "name": "ApprovalForAll",
            "type": "event",
          },
          {
            "anonymous": false,
            "inputs": [
              {
                "indexed": false,
                "internalType": "uint256",
                "name": "_fromTokenId",
                "type": "uint256",
              },
              {
                "indexed": false,
                "internalType": "uint256",
                "name": "_toTokenId",
                "type": "uint256",
              },
            ],
            "name": "BatchMetadataUpdate",
            "type": "event",
          },
          {
            "anonymous": false,
            "inputs": [
              {
                "indexed": false,
                "internalType": "string",
                "name": "prevURI",
                "type": "string",
              },
              {
                "indexed": false,
                "internalType": "string",
                "name": "newURI",
                "type": "string",
              },
            ],
            "name": "ContractURIUpdated",
            "type": "event",
          },
          {
            "anonymous": false,
            "inputs": [
              {
                "indexed": true,
                "internalType": "address",
                "name": "newRoyaltyRecipient",
                "type": "address",
              },
              {
                "indexed": false,
                "internalType": "uint256",
                "name": "newRoyaltyBps",
                "type": "uint256",
              },
            ],
            "name": "DefaultRoyalty",
            "type": "event",
          },
          {
            "anonymous": false,
            "inputs": [
              {
                "indexed": true,
                "internalType": "address",
                "name": "account",
                "type": "address",
              },
              {
                "indexed": false,
                "internalType": "uint256",
                "name": "level",
                "type": "uint256",
              },
            ],
            "name": "LevelUp",
            "type": "event",
          },
          {
            "anonymous": false,
            "inputs": [],
            "name": "MetadataFrozen",
            "type": "event",
          },
          {
            "anonymous": false,
            "inputs": [
              {
                "indexed": true,
                "internalType": "address",
                "name": "attacker",
                "type": "address",
              },
              {
                "indexed": true,
                "internalType": "address",
                "name": "victim",
                "type": "address",
              },
              {
                "indexed": false,
                "internalType": "uint256",
                "name": "level",
                "type": "uint256",
              },
            ],
            "name": "Miaowed",
            "type": "event",
          },
          {
            "anonymous": false,
            "inputs": [
              {
                "indexed": true,
                "internalType": "address",
                "name": "prevOwner",
                "type": "address",
              },
              {
                "indexed": true,
                "internalType": "address",
                "name": "newOwner",
                "type": "address",
              },
            ],
            "name": "OwnerUpdated",
            "type": "event",
          },
          {
            "anonymous": false,
            "inputs": [
              {
                "indexed": true,
                "internalType": "uint256",
                "name": "tokenId",
                "type": "uint256",
              },
              {
                "indexed": true,
                "internalType": "address",
                "name": "royaltyRecipient",
                "type": "address",
              },
              {
                "indexed": false,
                "internalType": "uint256",
                "name": "royaltyBps",
                "type": "uint256",
              },
            ],
            "name": "RoyaltyForToken",
            "type": "event",
          },
          {
            "anonymous": false,
            "inputs": [
              {
                "indexed": true,
                "internalType": "address",
                "name": "claimer",
                "type": "address",
              },
              {
                "indexed": true,
                "internalType": "address",
                "name": "receiver",
                "type": "address",
              },
              {
                "indexed": true,
                "internalType": "uint256",
                "name": "tokenId",
                "type": "uint256",
              },
              {
                "indexed": false,
                "internalType": "uint256",
                "name": "quantityClaimed",
                "type": "uint256",
              },
            ],
            "name": "TokensClaimed",
            "type": "event",
          },
          {
            "anonymous": false,
            "inputs": [
              {
                "indexed": true,
                "internalType": "uint256",
                "name": "startTokenId",
                "type": "uint256",
              },
              {
                "indexed": false,
                "internalType": "uint256",
                "name": "endTokenId",
                "type": "uint256",
              },
              {
                "indexed": false,
                "internalType": "string",
                "name": "baseURI",
                "type": "string",
              },
              {
                "indexed": false,
                "internalType": "bytes",
                "name": "encryptedBaseURI",
                "type": "bytes",
              },
            ],
            "name": "TokensLazyMinted",
            "type": "event",
          },
          {
            "anonymous": false,
            "inputs": [
              {
                "indexed": true,
                "internalType": "address",
                "name": "_operator",
                "type": "address",
              },
              {
                "indexed": true,
                "internalType": "address",
                "name": "_from",
                "type": "address",
              },
              {
                "indexed": true,
                "internalType": "address",
                "name": "_to",
                "type": "address",
              },
              {
                "indexed": false,
                "internalType": "uint256[]",
                "name": "_ids",
                "type": "uint256[]",
              },
              {
                "indexed": false,
                "internalType": "uint256[]",
                "name": "_values",
                "type": "uint256[]",
              },
            ],
            "name": "TransferBatch",
            "type": "event",
          },
          {
            "anonymous": false,
            "inputs": [
              {
                "indexed": true,
                "internalType": "address",
                "name": "_operator",
                "type": "address",
              },
              {
                "indexed": true,
                "internalType": "address",
                "name": "_from",
                "type": "address",
              },
              {
                "indexed": true,
                "internalType": "address",
                "name": "_to",
                "type": "address",
              },
              {
                "indexed": false,
                "internalType": "uint256",
                "name": "_id",
                "type": "uint256",
              },
              {
                "indexed": false,
                "internalType": "uint256",
                "name": "_value",
                "type": "uint256",
              },
            ],
            "name": "TransferSingle",
            "type": "event",
          },
          {
            "anonymous": false,
            "inputs": [
              {
                "indexed": false,
                "internalType": "string",
                "name": "_value",
                "type": "string",
              },
              {
                "indexed": true,
                "internalType": "uint256",
                "name": "_id",
                "type": "uint256",
              },
            ],
            "name": "URI",
            "type": "event",
          },
          {
            "inputs": [
              {
                "internalType": "address",
                "name": "victim",
                "type": "address",
              },
            ],
            "name": "attack",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function",
          },
          {
            "inputs": [
              {
                "internalType": "address",
                "name": "",
                "type": "address",
              },
              {
                "internalType": "uint256",
                "name": "",
                "type": "uint256",
              },
            ],
            "name": "balanceOf",
            "outputs": [
              {
                "internalType": "uint256",
                "name": "",
                "type": "uint256",
              },
            ],
            "stateMutability": "view",
            "type": "function",
          },
          {
            "inputs": [
              {
                "internalType": "address[]",
                "name": "accounts",
                "type": "address[]",
              },
              {
                "internalType": "uint256[]",
                "name": "ids",
                "type": "uint256[]",
              },
            ],
            "name": "balanceOfBatch",
            "outputs": [
              {
                "internalType": "uint256[]",
                "name": "",
                "type": "uint256[]",
              },
            ],
            "stateMutability": "view",
            "type": "function",
          },
          {
            "inputs": [
              {
                "internalType": "uint256",
                "name": "",
                "type": "uint256",
              },
            ],
            "name": "batchFrozen",
            "outputs": [
              {
                "internalType": "bool",
                "name": "",
                "type": "bool",
              },
            ],
            "stateMutability": "view",
            "type": "function",
          },
          {
            "inputs": [
              {
                "internalType": "address",
                "name": "account",
                "type": "address",
              },
              {
                "internalType": "uint256",
                "name": "id",
                "type": "uint256",
              },
              {
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256",
              },
            ],
            "name": "burn",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function",
          },
          {
            "inputs": [
              {
                "internalType": "address",
                "name": "_owner",
                "type": "address",
              },
              {
                "internalType": "uint256[]",
                "name": "_tokenIds",
                "type": "uint256[]",
              },
              {
                "internalType": "uint256[]",
                "name": "_amounts",
                "type": "uint256[]",
              },
            ],
            "name": "burnBatch",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function",
          },
          {
            "inputs": [
              {
                "internalType": "address",
                "name": "_receiver",
                "type": "address",
              },
              {
                "internalType": "uint256",
                "name": "_tokenId",
                "type": "uint256",
              },
              {
                "internalType": "uint256",
                "name": "_quantity",
                "type": "uint256",
              },
            ],
            "name": "claim",
            "outputs": [],
            "stateMutability": "payable",
            "type": "function",
          },
          {
            "inputs": [],
            "name": "claimKitten",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function",
          },
          {
            "inputs": [],
            "name": "contractURI",
            "outputs": [
              {
                "internalType": "string",
                "name": "",
                "type": "string",
              },
            ],
            "stateMutability": "view",
            "type": "function",
          },
          {
            "inputs": [],
            "name": "getBaseURICount",
            "outputs": [
              {
                "internalType": "uint256",
                "name": "",
                "type": "uint256",
              },
            ],
            "stateMutability": "view",
            "type": "function",
          },
          {
            "inputs": [
              {
                "internalType": "uint256",
                "name": "_index",
                "type": "uint256",
              },
            ],
            "name": "getBatchIdAtIndex",
            "outputs": [
              {
                "internalType": "uint256",
                "name": "",
                "type": "uint256",
              },
            ],
            "stateMutability": "view",
            "type": "function",
          },
          {
            "inputs": [],
            "name": "getDefaultRoyaltyInfo",
            "outputs": [
              {
                "internalType": "address",
                "name": "",
                "type": "address",
              },
              {
                "internalType": "uint16",
                "name": "",
                "type": "uint16",
              },
            ],
            "stateMutability": "view",
            "type": "function",
          },
          {
            "inputs": [
              {
                "internalType": "uint256",
                "name": "_tokenId",
                "type": "uint256",
              },
            ],
            "name": "getRoyaltyInfoForToken",
            "outputs": [
              {
                "internalType": "address",
                "name": "",
                "type": "address",
              },
              {
                "internalType": "uint16",
                "name": "",
                "type": "uint16",
              },
            ],
            "stateMutability": "view",
            "type": "function",
          },
          {
            "inputs": [
              {
                "internalType": "address",
                "name": "player",
                "type": "address",
              },
            ],
            "name": "getScore",
            "outputs": [
              {
                "internalType": "uint256",
                "name": "",
                "type": "uint256",
              },
            ],
            "stateMutability": "view",
            "type": "function",
          },
          {
            "inputs": [
              {
                "internalType": "address",
                "name": "",
                "type": "address",
              },
              {
                "internalType": "address",
                "name": "",
                "type": "address",
              },
            ],
            "name": "isApprovedForAll",
            "outputs": [
              {
                "internalType": "bool",
                "name": "",
                "type": "bool",
              },
            ],
            "stateMutability": "view",
            "type": "function",
          },
          {
            "inputs": [],
            "name": "isGamePaused",
            "outputs": [
              {
                "internalType": "bool",
                "name": "",
                "type": "bool",
              },
            ],
            "stateMutability": "view",
            "type": "function",
          },
          {
            "inputs": [
              {
                "internalType": "uint256",
                "name": "_amount",
                "type": "uint256",
              },
              {
                "internalType": "string",
                "name": "_baseURIForTokens",
                "type": "string",
              },
              {
                "internalType": "bytes",
                "name": "_data",
                "type": "bytes",
              },
            ],
            "name": "lazyMint",
            "outputs": [
              {
                "internalType": "uint256",
                "name": "batchId",
                "type": "uint256",
              },
            ],
            "stateMutability": "nonpayable",
            "type": "function",
          },
          {
            "inputs": [
              {
                "internalType": "bytes[]",
                "name": "data",
                "type": "bytes[]",
              },
            ],
            "name": "multicall",
            "outputs": [
              {
                "internalType": "bytes[]",
                "name": "results",
                "type": "bytes[]",
              },
            ],
            "stateMutability": "nonpayable",
            "type": "function",
          },
          {
            "inputs": [],
            "name": "name",
            "outputs": [
              {
                "internalType": "string",
                "name": "",
                "type": "string",
              },
            ],
            "stateMutability": "view",
            "type": "function",
          },
          {
            "inputs": [],
            "name": "nextTokenIdToMint",
            "outputs": [
              {
                "internalType": "uint256",
                "name": "",
                "type": "uint256",
              },
            ],
            "stateMutability": "view",
            "type": "function",
          },
          {
            "inputs": [],
            "name": "owner",
            "outputs": [
              {
                "internalType": "address",
                "name": "",
                "type": "address",
              },
            ],
            "stateMutability": "view",
            "type": "function",
          },
          {
            "inputs": [
              {
                "internalType": "uint256",
                "name": "tokenId",
                "type": "uint256",
              },
              {
                "internalType": "uint256",
                "name": "salePrice",
                "type": "uint256",
              },
            ],
            "name": "royaltyInfo",
            "outputs": [
              {
                "internalType": "address",
                "name": "receiver",
                "type": "address",
              },
              {
                "internalType": "uint256",
                "name": "royaltyAmount",
                "type": "uint256",
              },
            ],
            "stateMutability": "view",
            "type": "function",
          },
          {
            "inputs": [
              {
                "internalType": "address",
                "name": "from",
                "type": "address",
              },
              {
                "internalType": "address",
                "name": "to",
                "type": "address",
              },
              {
                "internalType": "uint256[]",
                "name": "ids",
                "type": "uint256[]",
              },
              {
                "internalType": "uint256[]",
                "name": "amounts",
                "type": "uint256[]",
              },
              {
                "internalType": "bytes",
                "name": "data",
                "type": "bytes",
              },
            ],
            "name": "safeBatchTransferFrom",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function",
          },
          {
            "inputs": [
              {
                "internalType": "address",
                "name": "from",
                "type": "address",
              },
              {
                "internalType": "address",
                "name": "to",
                "type": "address",
              },
              {
                "internalType": "uint256",
                "name": "id",
                "type": "uint256",
              },
              {
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256",
              },
              {
                "internalType": "bytes",
                "name": "data",
                "type": "bytes",
              },
            ],
            "name": "safeTransferFrom",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function",
          },
          {
            "inputs": [
              {
                "internalType": "address",
                "name": "operator",
                "type": "address",
              },
              {
                "internalType": "bool",
                "name": "approved",
                "type": "bool",
              },
            ],
            "name": "setApprovalForAll",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function",
          },
          {
            "inputs": [
              {
                "internalType": "string",
                "name": "_uri",
                "type": "string",
              },
            ],
            "name": "setContractURI",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function",
          },
          {
            "inputs": [
              {
                "internalType": "address",
                "name": "_royaltyRecipient",
                "type": "address",
              },
              {
                "internalType": "uint256",
                "name": "_royaltyBps",
                "type": "uint256",
              },
            ],
            "name": "setDefaultRoyaltyInfo",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function",
          },
          {
            "inputs": [
              {
                "internalType": "address",
                "name": "_newOwner",
                "type": "address",
              },
            ],
            "name": "setOwner",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function",
          },
          {
            "inputs": [
              {
                "internalType": "uint256",
                "name": "_tokenId",
                "type": "uint256",
              },
              {
                "internalType": "address",
                "name": "_recipient",
                "type": "address",
              },
              {
                "internalType": "uint256",
                "name": "_bps",
                "type": "uint256",
              },
            ],
            "name": "setRoyaltyInfoForToken",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function",
          },
          {
            "inputs": [],
            "name": "startGame",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function",
          },
          {
            "inputs": [],
            "name": "stopGame",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function",
          },
          {
            "inputs": [
              {
                "internalType": "bytes4",
                "name": "interfaceId",
                "type": "bytes4",
              },
            ],
            "name": "supportsInterface",
            "outputs": [
              {
                "internalType": "bool",
                "name": "",
                "type": "bool",
              },
            ],
            "stateMutability": "view",
            "type": "function",
          },
          {
            "inputs": [],
            "name": "symbol",
            "outputs": [
              {
                "internalType": "string",
                "name": "",
                "type": "string",
              },
            ],
            "stateMutability": "view",
            "type": "function",
          },
          {
            "inputs": [
              {
                "internalType": "uint256",
                "name": "",
                "type": "uint256",
              },
            ],
            "name": "totalSupply",
            "outputs": [
              {
                "internalType": "uint256",
                "name": "",
                "type": "uint256",
              },
            ],
            "stateMutability": "view",
            "type": "function",
          },
          {
            "inputs": [
              {
                "internalType": "uint256",
                "name": "_tokenId",
                "type": "uint256",
              },
            ],
            "name": "uri",
            "outputs": [
              {
                "internalType": "string",
                "name": "",
                "type": "string",
              },
            ],
            "stateMutability": "view",
            "type": "function",
          },
          {
            "inputs": [
              {
                "internalType": "address",
                "name": "_claimer",
                "type": "address",
              },
              {
                "internalType": "uint256",
                "name": "_tokenId",
                "type": "uint256",
              },
              {
                "internalType": "uint256",
                "name": "_quantity",
                "type": "uint256",
              },
            ],
            "name": "verifyClaim",
            "outputs": [],
            "stateMutability": "view",
            "type": "function",
          },
        ],
        "analytics": {
          "cli_version": "0.14.12",
          "command": "deploy",
          "contract_name": "CatAttackNFT",
          "from_ci": false,
          "project_type": "foundry",
          "uses_contract_extensions": true,
        },
        "bytecode": "0x6080604052600f805460ff1916905534801561001a57600080fd5b50604051613c4d380380613c4d8339810160408190526100399161022d565b33828282600083838261004c838261031b565b506001610059828261031b565b50506001600d555061006a85610089565b61007d826001600160801b0383166100db565b505050505050506103da565b600680546001600160a01b038381166001600160a01b0319831681179093556040519116919082907f8292fce18fa69edf4db7b94ea2e58241df0ae57f97e0a6c9b29067028bf92d7690600090a35050565b61271081111561010d57604051630a4930ad60e31b815261271060048201526024810182905260440160405180910390fd5b600780546001600160a01b0384166001600160b01b03199091168117600160a01b61ffff851602179091556040518281527f90d7ec04bcb8978719414f82e52e4cb651db41d0e6f8cea6118c2191e6183adb9060200160405180910390a25050565b634e487b7160e01b600052604160045260246000fd5b600082601f83011261019657600080fd5b81516001600160401b03808211156101b0576101b061016f565b604051601f8301601f19908116603f011681019082821181831017156101d8576101d861016f565b81604052838152602092508660208588010111156101f557600080fd5b600091505b8382101561021757858201830151818301840152908201906101fa565b6000602085830101528094505050505092915050565b6000806040838503121561024057600080fd5b82516001600160401b038082111561025757600080fd5b61026386838701610185565b9350602085015191508082111561027957600080fd5b5061028685828601610185565b9150509250929050565b600181811c908216806102a457607f821691505b6020821081036102c457634e487b7160e01b600052602260045260246000fd5b50919050565b601f821115610316576000816000526020600020601f850160051c810160208610156102f35750805b601f850160051c820191505b81811015610312578281556001016102ff565b5050505b505050565b81516001600160401b038111156103345761033461016f565b610348816103428454610290565b846102ca565b602080601f83116001811461037d57600084156103655750858301515b600019600386901b1c1916600185901b178555610312565b600085815260208120601f198616915b828110156103ac5788860151825594840194600190910190840161038d565b50858210156103ca5787850151600019600388901b60f8161c191681555b5050505050600190811b01905550565b613864806103e96000396000f3fe60806040526004361061020e5760003560e01c806383bd72ba11610118578063be895ece116100a0578063d65ab5f21161006f578063d65ab5f214610673578063e8a3d48514610688578063e985e9c51461069d578063f242432a146106d8578063f5298aca146106f857600080fd5b8063be895ece146105fe578063d018db3e14610613578063d37c353b14610633578063d47875d01461065357600080fd5b80639bcf7a15116100e75780639bcf7a1514610539578063a22cb46514610559578063ac9650d814610579578063b24f2d39146105a6578063bd85b039146105d157600080fd5b806383bd72ba146104c75780638da5cb5b146104dc578063938e3d7b1461050457806395d89b411461052457600080fd5b80632eb2c2d61161019b5780634e1273f41161016a5780634e1273f414610415578063600dd5ea1461044257806363b45e2d146104625780636b20c45414610477578063830405321461049757600080fd5b80632eb2c2d61461037e5780633b1475a71461039e5780634bbb1abf146103b35780634cc157df146103d357600080fd5b80630e89341c116101e25780630e89341c146102ca57806313af4035146102ea5780632419f51b1461030c5780632a55205a1461032c5780632bc43fd91461036b57600080fd5b8062fdd58e1461021357806301ffc9a71461025e5780630422ddf31461028e57806306fdde03146102a8575b600080fd5b34801561021f57600080fd5b5061024b61022e366004612ac1565b600260209081526000928352604080842090915290825290205481565b6040519081526020015b60405180910390f35b34801561026a57600080fd5b5061027e610279366004612b01565b610718565b6040519015158152602001610255565b34801561029a57600080fd5b50600f5461027e9060ff1681565b3480156102b457600080fd5b506102bd610785565b6040516102559190612b6e565b3480156102d657600080fd5b506102bd6102e5366004612b81565b610813565b3480156102f657600080fd5b5061030a610305366004612b9a565b610854565b005b34801561031857600080fd5b5061024b610327366004612b81565b610885565b34801561033857600080fd5b5061034c610347366004612bb5565b6108dc565b604080516001600160a01b039093168352602083019190915201610255565b61030a610379366004612bd7565b610919565b34801561038a57600080fd5b5061030a610399366004612d62565b610a1c565b3480156103aa57600080fd5b50600c5461024b565b3480156103bf57600080fd5b5061030a6103ce366004612bd7565b610aab565b3480156103df57600080fd5b506103f36103ee366004612b81565b610cda565b604080516001600160a01b03909316835261ffff909116602083015201610255565b34801561042157600080fd5b50610435610430366004612e0b565b610d45565b6040516102559190612f11565b34801561044e57600080fd5b5061030a61045d366004612ac1565b610e51565b34801561046e57600080fd5b5060095461024b565b34801561048357600080fd5b5061030a610492366004612f24565b610e84565b3480156104a357600080fd5b5061027e6104b2366004612b81565b600b6020526000908152604090205460ff1681565b3480156104d357600080fd5b5061030a61102c565b3480156104e857600080fd5b506006546040516001600160a01b039091168152602001610255565b34801561051057600080fd5b5061030a61051f366004612f97565b611095565b34801561053057600080fd5b506102bd6110c3565b34801561054557600080fd5b5061030a610554366004612fdf565b6110d0565b34801561056557600080fd5b5061030a610574366004613014565b611100565b34801561058557600080fd5b50610599610594366004613050565b6111b8565b60405161025591906130c4565b3480156105b257600080fd5b506007546001600160a01b03811690600160a01b900461ffff166103f3565b3480156105dd57600080fd5b5061024b6105ec366004612b81565b600e6020526000908152604090205481565b34801561060a57600080fd5b5061030a61131d565b34801561061f57600080fd5b5061030a61062e366004612b9a565b611350565b34801561063f57600080fd5b5061024b61064e366004613170565b611519565b34801561065f57600080fd5b5061024b61066e366004612b9a565b611610565b34801561067f57600080fd5b5061030a6116b6565b34801561069457600080fd5b506102bd61171c565b3480156106a957600080fd5b5061027e6106b83660046131e9565b600360209081526000928352604080842090915290825290205460ff1681565b3480156106e457600080fd5b5061030a6106f336600461321c565b611729565b34801561070457600080fd5b5061030a610713366004612bd7565b611853565b60006301ffc9a760e01b6001600160e01b0319831614806107495750636cdb3d1360e11b6001600160e01b03198316145b8061076457506303a24d0760e21b6001600160e01b03198316145b8061077f57506001600160e01b0319821663152a902d60e11b145b92915050565b6000805461079290613280565b80601f01602080910402602001604051908101604052809291908181526020018280546107be90613280565b801561080b5780601f106107e05761010080835404028352916020019161080b565b820191906000526020600020905b8154815290600101906020018083116107ee57829003601f168201915b505050505081565b6060600061082083611959565b90508061082c84611ad7565b60405160200161083d9291906132ba565b604051602081830303815290604052915050919050565b61085c611bdf565b610879576040516316ccb9cb60e11b815260040160405180910390fd5b61088281611c0c565b50565b600061089060095490565b82106108b757604051630793127760e11b8152600481018390526024015b60405180910390fd5b600982815481106108ca576108ca6132e9565b90600052602060002001549050919050565b6000806000806108eb86610cda565b90945084925061ffff1690506127106109048287613315565b61090e9190613342565b925050509250929050565b6002600d540361096b5760405162461bcd60e51b815260206004820152601f60248201527f5265656e7472616e637947756172643a207265656e7472616e742063616c6c0060448201526064016108ae565b6002600d55600c5482106109ae5760405162461bcd60e51b815260206004820152600a6024820152691a5b9d985b1a59081a5960b21b60448201526064016108ae565b6109b9338383610aab565b6109c4838383611c5e565b81836001600160a01b0316336001600160a01b03167fff097c7d8b1957a4ff09ef1361b5fb54dcede3941ba836d0beb9d10bec725de684604051610a0a91815260200190565b60405180910390a450506001600d5550565b6001600160a01b038516331480610a5657506001600160a01b038516600090815260036020908152604080832033845290915290205460ff165b610a975760405162461bcd60e51b81526020600482015260126024820152710853d5d3915497d3d497d054141493d5915160721b60448201526064016108ae565b610aa48585858585611c79565b5050505050565b600f5460ff1615610aec5760405162461bcd60e51b815260206004820152600b60248201526a11d0535157d4105554d15160aa1b60448201526064016108ae565b8115610b3a5760405162461bcd60e51b815260206004820152601b60248201527f4f6e6c79204b697474656e732063616e20626520636c61696d6564000000000060448201526064016108ae565b80600114610b8a5760405162461bcd60e51b815260206004820152601a60248201527f4f6e6c79206f6e65204b697474656e20617420612074696d652100000000000060448201526064016108ae565b6001600160a01b038316600090815260026020908152604080832083805290915290205415610bf25760405162461bcd60e51b815260206004820152601460248201527320b63932b0b23c9033b7ba10309025b4ba3a32b760611b60448201526064016108ae565b6001600160a01b03831660009081526002602090815260408083206001845290915290205415610c645760405162461bcd60e51b815260206004820152601860248201527f416c726561647920676f742061204772756d707920636174000000000000000060448201526064016108ae565b6001600160a01b038316600090815260026020818152604080842092845291905290205415610cd55760405162461bcd60e51b815260206004820152601760248201527f416c726561647920676f742061204e696e6a612063617400000000000000000060448201526064016108ae565b505050565b6000818152600860209081526040808320815180830190925280546001600160a01b031680835260019091015492820192909252829115610d215780516020820151610d3b565b6007546001600160a01b03811690600160a01b900461ffff165b9250925050915091565b60608151835114610d685760405162461bcd60e51b81526004016108ae90613356565b600083516001600160401b03811115610d8357610d83612c0a565b604051908082528060200260200182016040528015610dac578160200160208202803683370190505b50905060005b8451811015610e495760026000868381518110610dd157610dd16132e9565b60200260200101516001600160a01b03166001600160a01b031681526020019081526020016000206000858381518110610e0d57610e0d6132e9565b6020026020010151815260200190815260200160002054828281518110610e3657610e366132e9565b6020908102919091010152600101610db2565b509392505050565b610e59611bdf565b610e7657604051636fae358160e11b815260040160405180910390fd5b610e808282611e2d565b5050565b336001600160a01b038416811480610ec157506001600160a01b0380851660009081526003602090815260408083209385168352929052205460ff165b610f015760405162461bcd60e51b81526020600482015260116024820152702ab730b8383937bb32b21031b0b63632b960791b60448201526064016108ae565b8151835114610f445760405162461bcd60e51b815260206004820152600f60248201526e098cadccee8d040dad2e6dac2e8c6d608b1b60448201526064016108ae565b60005b835181101561101a57828181518110610f6257610f626132e9565b602002602001015160026000876001600160a01b03166001600160a01b031681526020019081526020016000206000868481518110610fa357610fa36132e9565b602002602001015181526020019081526020016000205410156110085760405162461bcd60e51b815260206004820152601760248201527f4e6f7420656e6f75676820746f6b656e73206f776e656400000000000000000060448201526064016108ae565b61101360018261337f565b9050610f47565b50611026848484611ebd565b50505050565b6006546001600160a01b031633146110865760405162461bcd60e51b815260206004820152601c60248201527f4f6e6c79206f776e65722063616e2073746f70207468652067616d650000000060448201526064016108ae565b600f805460ff19166001179055565b61109d611bdf565b6110ba57604051639f7f092560e01b815260040160405180910390fd5b61088281612068565b6001805461079290613280565b6110d8611bdf565b6110f557604051636fae358160e11b815260040160405180910390fd5b610cd5838383612144565b336001600160a01b038316810361114a5760405162461bcd60e51b815260206004820152600e60248201526d20a8282927ab24a723afa9a2a62360911b60448201526064016108ae565b6001600160a01b03818116600081815260036020908152604080832094881680845294825291829020805460ff191687151590811790915591519182527f17307eab39ab6107e8899845ad3d59bd9653f200f220920489ca2b5937696c3191015b60405180910390a3505050565b6060816001600160401b038111156111d2576111d2612c0a565b60405190808252806020026020018201604052801561120557816020015b60608152602001906001900390816111f05790505b509050336000805b8481101561131457811561128c5761126a30878784818110611231576112316132e9565b90506020028101906112439190613392565b86604051602001611256939291906133d8565b6040516020818303038152906040526121ef565b84828151811061127c5761127c6132e9565b602002602001018190525061130c565b6112ee308787848181106112a2576112a26132e9565b90506020028101906112b49190613392565b8080601f0160208091040260200160405190810160405280939291908181526020018383808284376000920191909152506121ef92505050565b848281518110611300576113006132e9565b60200260200101819052505b60010161120d565b50505092915050565b61132a3360006001610919565b60405160018152339060008051602061380f8339815191529060200160405180910390a2565b600f5460ff16156113735760405162461bcd60e51b81526004016108ae906133fe565b3360008181526002602081815260408084209284529190529020546113da5760405162461bcd60e51b815260206004820152601f60248201527f596f75206e6565642061206e696e6a612063617420746f2061747461636b210060448201526064016108ae565b6001600160a01b03821660009081526002602090815260408083208380529091528120541561140b575060006114ab565b6001600160a01b0383166000908152600260209081526040808320600184529091529020541561143d575060016114ab565b6001600160a01b03831660009081526002602081815260408084209284529190529020541561146e575060026114ab565b60405162461bcd60e51b815260206004820152601260248201527156696374696d20686173206e6f206361742160701b60448201526064016108ae565b6114b78382600161221b565b6114d4826003600160405180602001604052806000815250612340565b6001600160a01b038316337f0eb774bb9698a73583fe07b6972cf2dcc08d1d97581a22861f45feb86b39582061150b84600161337f565b6040519081526020016111ab565b6000611523611bdf565b6115405760405163f409ec7360e01b815260040160405180910390fd5b8560000361156157604051638fd36a9b60e01b815260040160405180910390fd5b6000600c5490506115a9818888888080601f01602080910402602001604051908101604052809392919081815260200183838082843760009201919091525061241992505050565b600c919091559150807f2a0365091ef1a40953c670dce28177e37520648a6fdc91506bffac0ab045570d60016115df8a8461337f565b6115e99190613426565b888888886040516115fe959493929190613462565b60405180910390a25095945050505050565b6001600160a01b0381166000908152600260208181526040808420600380865292528084205492845283205461164591613315565b6001600160a01b0384166000908152600260208181526040808420600185529091529091205461167491613315565b6001600160a01b03851660009081526002602090815260408083208380529091529020546116a2919061337f565b6116ac919061337f565b61077f919061337f565b6006546001600160a01b031633146117105760405162461bcd60e51b815260206004820152601d60248201527f4f6e6c79206f776e65722063616e207374617274207468652067616d6500000060448201526064016108ae565b600f805460ff19169055565b6005805461079290613280565b600f5460ff161561174c5760405162461bcd60e51b81526004016108ae906133fe565b821561179a5760405162461bcd60e51b815260206004820152601d60248201527f5468697320636174206973206e6f74207472616e7366657261626c652100000060448201526064016108ae565b6117a7858585858561247d565b836001600160a01b0316856001600160a01b0316141580156117c7575082155b15610aa4576117e88560018060405180602001604052806000815250612340565b836001600160a01b031660008051602061380f833981519152600160405161181291815260200190565b60405180910390a2846001600160a01b031660008051602061380f833981519152600260405161184491815260200190565b60405180910390a25050505050565b600f5460ff16156118765760405162461bcd60e51b81526004016108ae906133fe565b336001600160a01b03841614806118a6575033600090815260026020818152604080842092845291905290205415155b6118f25760405162461bcd60e51b815260206004820152601c60248201527f4e4f545f544f4b454e5f4f574e4552206f72206e696e6a61206361740000000060448201526064016108ae565b6118fd83838361221b565b81600103610cd557611922836002600160405180602001604052806000815250612340565b826001600160a01b031660008051602061380f833981519152600360405161194c91815260200190565b60405180910390a2505050565b6060600061196660095490565b9050600060098054806020026020016040519081016040528092919081815260200182805480156119b657602002820191906000526020600020905b8154815260200190600101908083116119a2575b5050505050905060005b82811015611aba578181815181106119da576119da6132e9565b6020026020010151851015611aa857600a60008383815181106119ff576119ff6132e9565b602002602001015181526020019081526020016000208054611a2090613280565b80601f0160208091040260200160405190810160405280929190818152602001828054611a4c90613280565b8015611a995780601f10611a6e57610100808354040283529160200191611a99565b820191906000526020600020905b815481529060010190602001808311611a7c57829003601f168201915b50505050509350505050919050565b611ab360018261337f565b90506119c0565b506040516309797f6960e21b8152600481018590526024016108ae565b606081600003611afe5750506040805180820190915260018152600360fc1b602082015290565b8160005b8115611b285780611b128161349b565b9150611b219050600a83613342565b9150611b02565b6000816001600160401b03811115611b4257611b42612c0a565b6040519080825280601f01601f191660200182016040528015611b6c576020820181803683370190505b5090505b8415611bd757611b81600183613426565b9150611b8e600a866134b4565b611b9990603061337f565b60f81b818381518110611bae57611bae6132e9565b60200101906001600160f81b031916908160001a905350611bd0600a86613342565b9450611b70565b949350505050565b6000611bf36006546001600160a01b031690565b6001600160a01b0316336001600160a01b031614905090565b600680546001600160a01b038381166001600160a01b0319831681179093556040519116919082907f8292fce18fa69edf4db7b94ea2e58241df0ae57f97e0a6c9b29067028bf92d7690600090a35050565b610cd583838360405180602001604052806000815250612340565b8151835114611c9a5760405162461bcd60e51b81526004016108ae90613356565b6001600160a01b038416611cc05760405162461bcd60e51b81526004016108ae906134c8565b33611ccf818787878787612505565b60005b8451811015611dbf576000858281518110611cef57611cef6132e9565b602002602001015190506000858381518110611d0d57611d0d6132e9565b6020908102919091018101516001600160a01b038b166000908152600283526040808220868352909352919091205490915081811015611d5f5760405162461bcd60e51b81526004016108ae906134ee565b6001600160a01b03808b16600090815260026020818152604080842088855282528084208787039055938d16835290815282822086835290529081208054849290611dab90849061337f565b909155505060019093019250611cd2915050565b50846001600160a01b0316866001600160a01b0316826001600160a01b03167f4a39dc06d4c0dbc64b70af90fd698a233a518aa5d07e595d983b8c0526c8f7fb8787604051611e0f929190613518565b60405180910390a4611e25818787878787612608565b505050505050565b612710811115611e5b57604051630a4930ad60e31b81526127106004820152602481018290526044016108ae565b600780546001600160a01b0384166001600160b01b03199091168117600160a01b61ffff851602179091556040518281527f90d7ec04bcb8978719414f82e52e4cb651db41d0e6f8cea6118c2191e6183adb9060200160405180910390a25050565b6001600160a01b038316611f045760405162461bcd60e51b815260206004820152600e60248201526d232927a6afad22a927afa0a2222960911b60448201526064016108ae565b8051825114611f255760405162461bcd60e51b81526004016108ae90613356565b6000339050611f4881856000868660405180602001604052806000815250612505565b60005b8351811015612009576000848281518110611f6857611f686132e9565b602002602001015190506000848381518110611f8657611f866132e9565b6020908102919091018101516001600160a01b0389166000908152600283526040808220868352909352919091205490915081811015611fd85760405162461bcd60e51b81526004016108ae906134ee565b6001600160a01b03881660009081526002602090815260408083209583529490529290922091039055600101611f4b565b5060006001600160a01b0316846001600160a01b0316826001600160a01b03167f4a39dc06d4c0dbc64b70af90fd698a233a518aa5d07e595d983b8c0526c8f7fb868660405161205a929190613518565b60405180910390a450505050565b60006005805461207790613280565b80601f01602080910402602001604051908101604052809291908181526020018280546120a390613280565b80156120f05780601f106120c5576101008083540402835291602001916120f0565b820191906000526020600020905b8154815290600101906020018083116120d357829003601f168201915b505050505090508160059081612106919061358e565b507fc9c7c3fe08b88b4df9d4d47ef47d2c43d55c025a0ba88ca442580ed9e7348a16818360405161213892919061364d565b60405180910390a15050565b61271081111561217257604051630a4930ad60e31b81526127106004820152602481018290526044016108ae565b6040805180820182526001600160a01b038481168083526020808401868152600089815260088352869020945185546001600160a01b031916941693909317845591516001909301929092559151838152909185917f7365cf4122f072a3365c20d54eff9b38d73c096c28e1892ec8f5b0e403a0f12d91016111ab565b606061221483836040518060600160405280602781526020016137e86027913961275b565b9392505050565b6001600160a01b0383166122625760405162461bcd60e51b815260206004820152600e60248201526d232927a6afad22a927afa0a2222960911b60448201526064016108ae565b3361229181856000612273876127d3565b61227c876127d3565b60405180602001604052806000815250612505565b6001600160a01b0384166000908152600260209081526040808320868452909152902054828110156122d55760405162461bcd60e51b81526004016108ae906134ee565b6001600160a01b03858116600081815260026020908152604080832089845282528083208887039055805189815291820188905291938616917fc3d58168c5ae7397731d063d5bbf3d657854427343f4c083240f7aacaa2d0f62910160405180910390a45050505050565b6001600160a01b0384166123665760405162461bcd60e51b81526004016108ae906134c8565b3361238681600087612377886127d3565b612380886127d3565b87612505565b6001600160a01b0385166000908152600260209081526040808320878452909152812080548592906123b990849061337f565b909155505060408051858152602081018590526001600160a01b0380881692600092918516917fc3d58168c5ae7397731d063d5bbf3d657854427343f4c083240f7aacaa2d0f62910160405180910390a4610aa48160008787878761281e565b600080612426848661337f565b60098054600181019091557f6e1540171b6c0c960b71a7020d9f60077f6af931a8bbf590da0223dacf75c7af018190556000818152600a60205260409020909250829150612474848261358e565b50935093915050565b6001600160a01b0385163314806124b757506001600160a01b038516600090815260036020908152604080832033845290915290205460ff165b6124f85760405162461bcd60e51b81526020600482015260126024820152710853d5d3915497d3d497d054141493d5915160721b60448201526064016108ae565b610aa485858585856128fb565b6001600160a01b0385166125835760005b835181101561258157828181518110612531576125316132e9565b6020026020010151600e600086848151811061254f5761254f6132e9565b602002602001015181526020019081526020016000206000828254612574919061337f565b9091555050600101612516565b505b6001600160a01b038416611e255760005b83518110156125ff578281815181106125af576125af6132e9565b6020026020010151600e60008684815181106125cd576125cd6132e9565b6020026020010151815260200190815260200160002060008282546125f29190613426565b9091555050600101612594565b50505050505050565b6001600160a01b0384163b15611e255760405163bc197c8160e01b81526001600160a01b0385169063bc197c819061264c9089908990889088908890600401613672565b6020604051808303816000875af1925050508015612687575060408051601f3d908101601f19168201909252612684918101906136c4565b60015b612709576126936136e1565b806308c379a0036126cc57506126a76136fd565b806126b257506126ce565b8060405162461bcd60e51b81526004016108ae9190612b6e565b505b60405162461bcd60e51b815260206004820152601060248201526f10a2a92198989a9aa922a1a2a4ab22a960811b60448201526064016108ae565b6001600160e01b0319811663bc197c8160e01b146125ff5760405162461bcd60e51b815260206004820152600f60248201526e1513d2d15394d7d491529150d51151608a1b60448201526064016108ae565b6060600080856001600160a01b0316856040516127789190613786565b600060405180830381855af49150503d80600081146127b3576040519150601f19603f3d011682016040523d82523d6000602084013e6127b8565b606091505b50915091506127c986838387612a21565b9695505050505050565b6040805160018082528183019092526060916000919060208083019080368337019050509050828160008151811061280d5761280d6132e9565b602090810291909101015292915050565b6001600160a01b0384163b15611e255760405163f23a6e6160e01b81526001600160a01b0385169063f23a6e619061286290899089908890889088906004016137a2565b6020604051808303816000875af192505050801561289d575060408051601f3d908101601f1916820190925261289a918101906136c4565b60015b6128a9576126936136e1565b6001600160e01b0319811663f23a6e6160e01b146125ff5760405162461bcd60e51b815260206004820152600f60248201526e1513d2d15394d7d491529150d51151608a1b60448201526064016108ae565b6001600160a01b0384166129215760405162461bcd60e51b81526004016108ae906134c8565b33612931818787612377886127d3565b6001600160a01b0386166000908152600260209081526040808320878452909152902054838110156129755760405162461bcd60e51b81526004016108ae906134ee565b6001600160a01b0380881660009081526002602081815260408084208a855282528084208987039055938a168352908152828220888352905290812080548692906129c190849061337f565b909155505060408051868152602081018690526001600160a01b03808916928a821692918616917fc3d58168c5ae7397731d063d5bbf3d657854427343f4c083240f7aacaa2d0f62910160405180910390a46125ff82888888888861281e565b60608315612a90578251600003612a89576001600160a01b0385163b612a895760405162461bcd60e51b815260206004820152601d60248201527f416464726573733a2063616c6c20746f206e6f6e2d636f6e747261637400000060448201526064016108ae565b5081611bd7565b611bd783838151156126b25781518083602001fd5b80356001600160a01b0381168114612abc57600080fd5b919050565b60008060408385031215612ad457600080fd5b612add83612aa5565b946020939093013593505050565b6001600160e01b03198116811461088257600080fd5b600060208284031215612b1357600080fd5b813561221481612aeb565b60005b83811015612b39578181015183820152602001612b21565b50506000910152565b60008151808452612b5a816020860160208601612b1e565b601f01601f19169290920160200192915050565b6020815260006122146020830184612b42565b600060208284031215612b9357600080fd5b5035919050565b600060208284031215612bac57600080fd5b61221482612aa5565b60008060408385031215612bc857600080fd5b50508035926020909101359150565b600080600060608486031215612bec57600080fd5b612bf584612aa5565b95602085013595506040909401359392505050565b634e487b7160e01b600052604160045260246000fd5b601f8201601f191681016001600160401b0381118282101715612c4557612c45612c0a565b6040525050565b60006001600160401b03821115612c6557612c65612c0a565b5060051b60200190565b600082601f830112612c8057600080fd5b81356020612c8d82612c4c565b604051612c9a8282612c20565b80915083815260208101915060208460051b870101935086841115612cbe57600080fd5b602086015b84811015612cda5780358352918301918301612cc3565b509695505050505050565b60006001600160401b03831115612cfe57612cfe612c0a565b604051612d15601f8501601f191660200182612c20565b809150838152848484011115612d2a57600080fd5b83836020830137600060208583010152509392505050565b600082601f830112612d5357600080fd5b61221483833560208501612ce5565b600080600080600060a08688031215612d7a57600080fd5b612d8386612aa5565b9450612d9160208701612aa5565b935060408601356001600160401b0380821115612dad57600080fd5b612db989838a01612c6f565b94506060880135915080821115612dcf57600080fd5b612ddb89838a01612c6f565b93506080880135915080821115612df157600080fd5b50612dfe88828901612d42565b9150509295509295909350565b60008060408385031215612e1e57600080fd5b82356001600160401b0380821115612e3557600080fd5b818501915085601f830112612e4957600080fd5b81356020612e5682612c4c565b604051612e638282612c20565b83815260059390931b8501820192828101915089841115612e8357600080fd5b948201945b83861015612ea857612e9986612aa5565b82529482019490820190612e88565b96505086013592505080821115612ebe57600080fd5b50612ecb85828601612c6f565b9150509250929050565b60008151808452602080850194506020840160005b83811015612f0657815187529582019590820190600101612eea565b509495945050505050565b6020815260006122146020830184612ed5565b600080600060608486031215612f3957600080fd5b612f4284612aa5565b925060208401356001600160401b0380821115612f5e57600080fd5b612f6a87838801612c6f565b93506040860135915080821115612f8057600080fd5b50612f8d86828701612c6f565b9150509250925092565b600060208284031215612fa957600080fd5b81356001600160401b03811115612fbf57600080fd5b8201601f81018413612fd057600080fd5b611bd784823560208401612ce5565b600080600060608486031215612ff457600080fd5b8335925061300460208501612aa5565b9150604084013590509250925092565b6000806040838503121561302757600080fd5b61303083612aa5565b91506020830135801515811461304557600080fd5b809150509250929050565b6000806020838503121561306357600080fd5b82356001600160401b038082111561307a57600080fd5b818501915085601f83011261308e57600080fd5b81358181111561309d57600080fd5b8660208260051b85010111156130b257600080fd5b60209290920196919550909350505050565b600060208083016020845280855180835260408601915060408160051b87010192506020870160005b8281101561311b57603f19888603018452613109858351612b42565b945092850192908501906001016130ed565b5092979650505050505050565b60008083601f84011261313a57600080fd5b5081356001600160401b0381111561315157600080fd5b60208301915083602082850101111561316957600080fd5b9250929050565b60008060008060006060868803121561318857600080fd5b8535945060208601356001600160401b03808211156131a657600080fd5b6131b289838a01613128565b909650945060408801359150808211156131cb57600080fd5b506131d888828901613128565b969995985093965092949392505050565b600080604083850312156131fc57600080fd5b61320583612aa5565b915061321360208401612aa5565b90509250929050565b600080600080600060a0868803121561323457600080fd5b61323d86612aa5565b945061324b60208701612aa5565b9350604086013592506060860135915060808601356001600160401b0381111561327457600080fd5b612dfe88828901612d42565b600181811c9082168061329457607f821691505b6020821081036132b457634e487b7160e01b600052602260045260246000fd5b50919050565b600083516132cc818460208801612b1e565b8351908301906132e0818360208801612b1e565b01949350505050565b634e487b7160e01b600052603260045260246000fd5b634e487b7160e01b600052601160045260246000fd5b808202811582820484141761077f5761077f6132ff565b634e487b7160e01b600052601260045260246000fd5b6000826133515761335161332c565b500490565b6020808252600f908201526e0988a9c8ea890be9a92a69a82a8869608b1b604082015260600190565b8082018082111561077f5761077f6132ff565b6000808335601e198436030181126133a957600080fd5b8301803591506001600160401b038211156133c357600080fd5b60200191503681900382131561316957600080fd5b8284823760609190911b6bffffffffffffffffffffffff19169101908152601401919050565b6020808252600e908201526d11d85b59481a5cc81c185d5cd95960921b604082015260600190565b8181038181111561077f5761077f6132ff565b81835281816020850137506000828201602090810191909152601f909101601f19169091010190565b85815260606020820152600061347c606083018688613439565b828103604084015261348f818587613439565b98975050505050505050565b6000600182016134ad576134ad6132ff565b5060010190565b6000826134c3576134c361332c565b500690565b6020808252600c908201526b2a27afad22a927afa0a2222960a11b604082015260600190565b60208082526010908201526f125394d551919250d251539517d0905360821b604082015260600190565b60408152600061352b6040830185612ed5565b828103602084015261353d8185612ed5565b95945050505050565b601f821115610cd5576000816000526020600020601f850160051c8101602086101561356f5750805b601f850160051c820191505b81811015611e255782815560010161357b565b81516001600160401b038111156135a7576135a7612c0a565b6135bb816135b58454613280565b84613546565b602080601f8311600181146135f057600084156135d85750858301515b600019600386901b1c1916600185901b178555611e25565b600085815260208120601f198616915b8281101561361f57888601518255948401946001909101908401613600565b508582101561363d5787850151600019600388901b60f8161c191681555b5050505050600190811b01905550565b6040815260006136606040830185612b42565b828103602084015261353d8185612b42565b6001600160a01b0386811682528516602082015260a06040820181905260009061369e90830186612ed5565b82810360608401526136b08186612ed5565b9050828103608084015261348f8185612b42565b6000602082840312156136d657600080fd5b815161221481612aeb565b600060033d11156136fa5760046000803e5060005160e01c5b90565b600060443d101561370b5790565b6040516003193d81016004833e81513d6001600160401b03816024840111818411171561373a57505050505090565b82850191508151818111156137525750505050505090565b843d870101602082850101111561376c5750505050505090565b61377b60208286010187612c20565b509095945050505050565b60008251613798818460208701612b1e565b9190910192915050565b6001600160a01b03868116825285166020820152604081018490526060810183905260a0608082018190526000906137dc90830184612b42565b97965050505050505056fe416464726573733a206c6f772d6c6576656c2064656c65676174652063616c6c206661696c656491e51c29e7e87a74ad3b8ccba98538970f50a4309242735467f41e27c6b0fbaca2646970667358221220da27a6fbfac6216f30715fab4865cfe7a5b74a4f70b1235ceb15fd486298378664736f6c63430008190033",
        "bytecodeUri": "ipfs://QmVyB9qAs7XdZYNGPcNbff43BX1tyZFJkqdfp1eXiNS8AG/0",
        "changelog": "Initial release",
        "compiler": {
          "version": "0.8.25+commit.b61c2a91",
        },
        "compilers": {
          "solc": [
            {
              "bytecodeUri": "ipfs://QmVyB9qAs7XdZYNGPcNbff43BX1tyZFJkqdfp1eXiNS8AG/0",
              "compilerVersion": "",
              "evmVersion": "",
              "metadataUri": "ipfs://Qmd2Ef29NzCjomqYXZbWa8ZdF1AESDAS1HDAonmAnTgHPs",
            },
          ],
        },
        "description": "Cat Attack NFT",
        "info": {
          "author": undefined,
          "details": undefined,
          "notice": undefined,
          "title": "CatAttackNFT - The game contract for https://catattacknft.vercel.app/",
        },
        "isPartialAbi": undefined,
        "language": "Solidity",
        "licenses": [
          "Apache-2.0",
          "Apache 2.0",
          "MIT",
        ],
        "metadata": {
          "compiler": {
            "version": "0.8.25+commit.b61c2a91",
          },
          "language": "Solidity",
          "output": {
            "abi": [
              {
                "inputs": [
                  {
                    "internalType": "string",
                    "name": "_name",
                    "type": "string",
                  },
                  {
                    "internalType": "string",
                    "name": "_symbol",
                    "type": "string",
                  },
                ],
                "stateMutability": "nonpayable",
                "type": "constructor",
              },
              {
                "inputs": [
                  {
                    "internalType": "uint256",
                    "name": "index",
                    "type": "uint256",
                  },
                ],
                "name": "BatchMintInvalidBatchId",
                "type": "error",
              },
              {
                "inputs": [
                  {
                    "internalType": "uint256",
                    "name": "tokenId",
                    "type": "uint256",
                  },
                ],
                "name": "BatchMintInvalidTokenId",
                "type": "error",
              },
              {
                "inputs": [
                  {
                    "internalType": "uint256",
                    "name": "batchId",
                    "type": "uint256",
                  },
                ],
                "name": "BatchMintMetadataFrozen",
                "type": "error",
              },
              {
                "inputs": [],
                "name": "ContractMetadataUnauthorized",
                "type": "error",
              },
              {
                "inputs": [],
                "name": "LazyMintInvalidAmount",
                "type": "error",
              },
              {
                "inputs": [],
                "name": "LazyMintUnauthorized",
                "type": "error",
              },
              {
                "inputs": [],
                "name": "OwnableUnauthorized",
                "type": "error",
              },
              {
                "inputs": [
                  {
                    "internalType": "uint256",
                    "name": "max",
                    "type": "uint256",
                  },
                  {
                    "internalType": "uint256",
                    "name": "actual",
                    "type": "uint256",
                  },
                ],
                "name": "RoyaltyExceededMaxFeeBps",
                "type": "error",
              },
              {
                "inputs": [
                  {
                    "internalType": "address",
                    "name": "recipient",
                    "type": "address",
                  },
                ],
                "name": "RoyaltyInvalidRecipient",
                "type": "error",
              },
              {
                "inputs": [],
                "name": "RoyaltyUnauthorized",
                "type": "error",
              },
              {
                "anonymous": false,
                "inputs": [
                  {
                    "indexed": true,
                    "internalType": "address",
                    "name": "_owner",
                    "type": "address",
                  },
                  {
                    "indexed": true,
                    "internalType": "address",
                    "name": "_operator",
                    "type": "address",
                  },
                  {
                    "indexed": false,
                    "internalType": "bool",
                    "name": "_approved",
                    "type": "bool",
                  },
                ],
                "name": "ApprovalForAll",
                "type": "event",
              },
              {
                "anonymous": false,
                "inputs": [
                  {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "_fromTokenId",
                    "type": "uint256",
                  },
                  {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "_toTokenId",
                    "type": "uint256",
                  },
                ],
                "name": "BatchMetadataUpdate",
                "type": "event",
              },
              {
                "anonymous": false,
                "inputs": [
                  {
                    "indexed": false,
                    "internalType": "string",
                    "name": "prevURI",
                    "type": "string",
                  },
                  {
                    "indexed": false,
                    "internalType": "string",
                    "name": "newURI",
                    "type": "string",
                  },
                ],
                "name": "ContractURIUpdated",
                "type": "event",
              },
              {
                "anonymous": false,
                "inputs": [
                  {
                    "indexed": true,
                    "internalType": "address",
                    "name": "newRoyaltyRecipient",
                    "type": "address",
                  },
                  {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "newRoyaltyBps",
                    "type": "uint256",
                  },
                ],
                "name": "DefaultRoyalty",
                "type": "event",
              },
              {
                "anonymous": false,
                "inputs": [
                  {
                    "indexed": true,
                    "internalType": "address",
                    "name": "account",
                    "type": "address",
                  },
                  {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "level",
                    "type": "uint256",
                  },
                ],
                "name": "LevelUp",
                "type": "event",
              },
              {
                "anonymous": false,
                "inputs": [],
                "name": "MetadataFrozen",
                "type": "event",
              },
              {
                "anonymous": false,
                "inputs": [
                  {
                    "indexed": true,
                    "internalType": "address",
                    "name": "attacker",
                    "type": "address",
                  },
                  {
                    "indexed": true,
                    "internalType": "address",
                    "name": "victim",
                    "type": "address",
                  },
                  {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "level",
                    "type": "uint256",
                  },
                ],
                "name": "Miaowed",
                "type": "event",
              },
              {
                "anonymous": false,
                "inputs": [
                  {
                    "indexed": true,
                    "internalType": "address",
                    "name": "prevOwner",
                    "type": "address",
                  },
                  {
                    "indexed": true,
                    "internalType": "address",
                    "name": "newOwner",
                    "type": "address",
                  },
                ],
                "name": "OwnerUpdated",
                "type": "event",
              },
              {
                "anonymous": false,
                "inputs": [
                  {
                    "indexed": true,
                    "internalType": "uint256",
                    "name": "tokenId",
                    "type": "uint256",
                  },
                  {
                    "indexed": true,
                    "internalType": "address",
                    "name": "royaltyRecipient",
                    "type": "address",
                  },
                  {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "royaltyBps",
                    "type": "uint256",
                  },
                ],
                "name": "RoyaltyForToken",
                "type": "event",
              },
              {
                "anonymous": false,
                "inputs": [
                  {
                    "indexed": true,
                    "internalType": "address",
                    "name": "claimer",
                    "type": "address",
                  },
                  {
                    "indexed": true,
                    "internalType": "address",
                    "name": "receiver",
                    "type": "address",
                  },
                  {
                    "indexed": true,
                    "internalType": "uint256",
                    "name": "tokenId",
                    "type": "uint256",
                  },
                  {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "quantityClaimed",
                    "type": "uint256",
                  },
                ],
                "name": "TokensClaimed",
                "type": "event",
              },
              {
                "anonymous": false,
                "inputs": [
                  {
                    "indexed": true,
                    "internalType": "uint256",
                    "name": "startTokenId",
                    "type": "uint256",
                  },
                  {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "endTokenId",
                    "type": "uint256",
                  },
                  {
                    "indexed": false,
                    "internalType": "string",
                    "name": "baseURI",
                    "type": "string",
                  },
                  {
                    "indexed": false,
                    "internalType": "bytes",
                    "name": "encryptedBaseURI",
                    "type": "bytes",
                  },
                ],
                "name": "TokensLazyMinted",
                "type": "event",
              },
              {
                "anonymous": false,
                "inputs": [
                  {
                    "indexed": true,
                    "internalType": "address",
                    "name": "_operator",
                    "type": "address",
                  },
                  {
                    "indexed": true,
                    "internalType": "address",
                    "name": "_from",
                    "type": "address",
                  },
                  {
                    "indexed": true,
                    "internalType": "address",
                    "name": "_to",
                    "type": "address",
                  },
                  {
                    "indexed": false,
                    "internalType": "uint256[]",
                    "name": "_ids",
                    "type": "uint256[]",
                  },
                  {
                    "indexed": false,
                    "internalType": "uint256[]",
                    "name": "_values",
                    "type": "uint256[]",
                  },
                ],
                "name": "TransferBatch",
                "type": "event",
              },
              {
                "anonymous": false,
                "inputs": [
                  {
                    "indexed": true,
                    "internalType": "address",
                    "name": "_operator",
                    "type": "address",
                  },
                  {
                    "indexed": true,
                    "internalType": "address",
                    "name": "_from",
                    "type": "address",
                  },
                  {
                    "indexed": true,
                    "internalType": "address",
                    "name": "_to",
                    "type": "address",
                  },
                  {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "_id",
                    "type": "uint256",
                  },
                  {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "_value",
                    "type": "uint256",
                  },
                ],
                "name": "TransferSingle",
                "type": "event",
              },
              {
                "anonymous": false,
                "inputs": [
                  {
                    "indexed": false,
                    "internalType": "string",
                    "name": "_value",
                    "type": "string",
                  },
                  {
                    "indexed": true,
                    "internalType": "uint256",
                    "name": "_id",
                    "type": "uint256",
                  },
                ],
                "name": "URI",
                "type": "event",
              },
              {
                "inputs": [
                  {
                    "internalType": "address",
                    "name": "victim",
                    "type": "address",
                  },
                ],
                "name": "attack",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function",
              },
              {
                "inputs": [
                  {
                    "internalType": "address",
                    "name": "",
                    "type": "address",
                  },
                  {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256",
                  },
                ],
                "name": "balanceOf",
                "outputs": [
                  {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256",
                  },
                ],
                "stateMutability": "view",
                "type": "function",
              },
              {
                "inputs": [
                  {
                    "internalType": "address[]",
                    "name": "accounts",
                    "type": "address[]",
                  },
                  {
                    "internalType": "uint256[]",
                    "name": "ids",
                    "type": "uint256[]",
                  },
                ],
                "name": "balanceOfBatch",
                "outputs": [
                  {
                    "internalType": "uint256[]",
                    "name": "",
                    "type": "uint256[]",
                  },
                ],
                "stateMutability": "view",
                "type": "function",
              },
              {
                "inputs": [
                  {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256",
                  },
                ],
                "name": "batchFrozen",
                "outputs": [
                  {
                    "internalType": "bool",
                    "name": "",
                    "type": "bool",
                  },
                ],
                "stateMutability": "view",
                "type": "function",
              },
              {
                "inputs": [
                  {
                    "internalType": "address",
                    "name": "account",
                    "type": "address",
                  },
                  {
                    "internalType": "uint256",
                    "name": "id",
                    "type": "uint256",
                  },
                  {
                    "internalType": "uint256",
                    "name": "amount",
                    "type": "uint256",
                  },
                ],
                "name": "burn",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function",
              },
              {
                "inputs": [
                  {
                    "internalType": "address",
                    "name": "_owner",
                    "type": "address",
                  },
                  {
                    "internalType": "uint256[]",
                    "name": "_tokenIds",
                    "type": "uint256[]",
                  },
                  {
                    "internalType": "uint256[]",
                    "name": "_amounts",
                    "type": "uint256[]",
                  },
                ],
                "name": "burnBatch",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function",
              },
              {
                "inputs": [
                  {
                    "internalType": "address",
                    "name": "_receiver",
                    "type": "address",
                  },
                  {
                    "internalType": "uint256",
                    "name": "_tokenId",
                    "type": "uint256",
                  },
                  {
                    "internalType": "uint256",
                    "name": "_quantity",
                    "type": "uint256",
                  },
                ],
                "name": "claim",
                "outputs": [],
                "stateMutability": "payable",
                "type": "function",
              },
              {
                "inputs": [],
                "name": "claimKitten",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function",
              },
              {
                "inputs": [],
                "name": "contractURI",
                "outputs": [
                  {
                    "internalType": "string",
                    "name": "",
                    "type": "string",
                  },
                ],
                "stateMutability": "view",
                "type": "function",
              },
              {
                "inputs": [],
                "name": "getBaseURICount",
                "outputs": [
                  {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256",
                  },
                ],
                "stateMutability": "view",
                "type": "function",
              },
              {
                "inputs": [
                  {
                    "internalType": "uint256",
                    "name": "_index",
                    "type": "uint256",
                  },
                ],
                "name": "getBatchIdAtIndex",
                "outputs": [
                  {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256",
                  },
                ],
                "stateMutability": "view",
                "type": "function",
              },
              {
                "inputs": [],
                "name": "getDefaultRoyaltyInfo",
                "outputs": [
                  {
                    "internalType": "address",
                    "name": "",
                    "type": "address",
                  },
                  {
                    "internalType": "uint16",
                    "name": "",
                    "type": "uint16",
                  },
                ],
                "stateMutability": "view",
                "type": "function",
              },
              {
                "inputs": [
                  {
                    "internalType": "uint256",
                    "name": "_tokenId",
                    "type": "uint256",
                  },
                ],
                "name": "getRoyaltyInfoForToken",
                "outputs": [
                  {
                    "internalType": "address",
                    "name": "",
                    "type": "address",
                  },
                  {
                    "internalType": "uint16",
                    "name": "",
                    "type": "uint16",
                  },
                ],
                "stateMutability": "view",
                "type": "function",
              },
              {
                "inputs": [
                  {
                    "internalType": "address",
                    "name": "player",
                    "type": "address",
                  },
                ],
                "name": "getScore",
                "outputs": [
                  {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256",
                  },
                ],
                "stateMutability": "view",
                "type": "function",
              },
              {
                "inputs": [
                  {
                    "internalType": "address",
                    "name": "",
                    "type": "address",
                  },
                  {
                    "internalType": "address",
                    "name": "",
                    "type": "address",
                  },
                ],
                "name": "isApprovedForAll",
                "outputs": [
                  {
                    "internalType": "bool",
                    "name": "",
                    "type": "bool",
                  },
                ],
                "stateMutability": "view",
                "type": "function",
              },
              {
                "inputs": [],
                "name": "isGamePaused",
                "outputs": [
                  {
                    "internalType": "bool",
                    "name": "",
                    "type": "bool",
                  },
                ],
                "stateMutability": "view",
                "type": "function",
              },
              {
                "inputs": [
                  {
                    "internalType": "uint256",
                    "name": "_amount",
                    "type": "uint256",
                  },
                  {
                    "internalType": "string",
                    "name": "_baseURIForTokens",
                    "type": "string",
                  },
                  {
                    "internalType": "bytes",
                    "name": "_data",
                    "type": "bytes",
                  },
                ],
                "name": "lazyMint",
                "outputs": [
                  {
                    "internalType": "uint256",
                    "name": "batchId",
                    "type": "uint256",
                  },
                ],
                "stateMutability": "nonpayable",
                "type": "function",
              },
              {
                "inputs": [
                  {
                    "internalType": "bytes[]",
                    "name": "data",
                    "type": "bytes[]",
                  },
                ],
                "name": "multicall",
                "outputs": [
                  {
                    "internalType": "bytes[]",
                    "name": "results",
                    "type": "bytes[]",
                  },
                ],
                "stateMutability": "nonpayable",
                "type": "function",
              },
              {
                "inputs": [],
                "name": "name",
                "outputs": [
                  {
                    "internalType": "string",
                    "name": "",
                    "type": "string",
                  },
                ],
                "stateMutability": "view",
                "type": "function",
              },
              {
                "inputs": [],
                "name": "nextTokenIdToMint",
                "outputs": [
                  {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256",
                  },
                ],
                "stateMutability": "view",
                "type": "function",
              },
              {
                "inputs": [],
                "name": "owner",
                "outputs": [
                  {
                    "internalType": "address",
                    "name": "",
                    "type": "address",
                  },
                ],
                "stateMutability": "view",
                "type": "function",
              },
              {
                "inputs": [
                  {
                    "internalType": "uint256",
                    "name": "tokenId",
                    "type": "uint256",
                  },
                  {
                    "internalType": "uint256",
                    "name": "salePrice",
                    "type": "uint256",
                  },
                ],
                "name": "royaltyInfo",
                "outputs": [
                  {
                    "internalType": "address",
                    "name": "receiver",
                    "type": "address",
                  },
                  {
                    "internalType": "uint256",
                    "name": "royaltyAmount",
                    "type": "uint256",
                  },
                ],
                "stateMutability": "view",
                "type": "function",
              },
              {
                "inputs": [
                  {
                    "internalType": "address",
                    "name": "from",
                    "type": "address",
                  },
                  {
                    "internalType": "address",
                    "name": "to",
                    "type": "address",
                  },
                  {
                    "internalType": "uint256[]",
                    "name": "ids",
                    "type": "uint256[]",
                  },
                  {
                    "internalType": "uint256[]",
                    "name": "amounts",
                    "type": "uint256[]",
                  },
                  {
                    "internalType": "bytes",
                    "name": "data",
                    "type": "bytes",
                  },
                ],
                "name": "safeBatchTransferFrom",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function",
              },
              {
                "inputs": [
                  {
                    "internalType": "address",
                    "name": "from",
                    "type": "address",
                  },
                  {
                    "internalType": "address",
                    "name": "to",
                    "type": "address",
                  },
                  {
                    "internalType": "uint256",
                    "name": "id",
                    "type": "uint256",
                  },
                  {
                    "internalType": "uint256",
                    "name": "amount",
                    "type": "uint256",
                  },
                  {
                    "internalType": "bytes",
                    "name": "data",
                    "type": "bytes",
                  },
                ],
                "name": "safeTransferFrom",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function",
              },
              {
                "inputs": [
                  {
                    "internalType": "address",
                    "name": "operator",
                    "type": "address",
                  },
                  {
                    "internalType": "bool",
                    "name": "approved",
                    "type": "bool",
                  },
                ],
                "name": "setApprovalForAll",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function",
              },
              {
                "inputs": [
                  {
                    "internalType": "string",
                    "name": "_uri",
                    "type": "string",
                  },
                ],
                "name": "setContractURI",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function",
              },
              {
                "inputs": [
                  {
                    "internalType": "address",
                    "name": "_royaltyRecipient",
                    "type": "address",
                  },
                  {
                    "internalType": "uint256",
                    "name": "_royaltyBps",
                    "type": "uint256",
                  },
                ],
                "name": "setDefaultRoyaltyInfo",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function",
              },
              {
                "inputs": [
                  {
                    "internalType": "address",
                    "name": "_newOwner",
                    "type": "address",
                  },
                ],
                "name": "setOwner",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function",
              },
              {
                "inputs": [
                  {
                    "internalType": "uint256",
                    "name": "_tokenId",
                    "type": "uint256",
                  },
                  {
                    "internalType": "address",
                    "name": "_recipient",
                    "type": "address",
                  },
                  {
                    "internalType": "uint256",
                    "name": "_bps",
                    "type": "uint256",
                  },
                ],
                "name": "setRoyaltyInfoForToken",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function",
              },
              {
                "inputs": [],
                "name": "startGame",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function",
              },
              {
                "inputs": [],
                "name": "stopGame",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function",
              },
              {
                "inputs": [
                  {
                    "internalType": "bytes4",
                    "name": "interfaceId",
                    "type": "bytes4",
                  },
                ],
                "name": "supportsInterface",
                "outputs": [
                  {
                    "internalType": "bool",
                    "name": "",
                    "type": "bool",
                  },
                ],
                "stateMutability": "view",
                "type": "function",
              },
              {
                "inputs": [],
                "name": "symbol",
                "outputs": [
                  {
                    "internalType": "string",
                    "name": "",
                    "type": "string",
                  },
                ],
                "stateMutability": "view",
                "type": "function",
              },
              {
                "inputs": [
                  {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256",
                  },
                ],
                "name": "totalSupply",
                "outputs": [
                  {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256",
                  },
                ],
                "stateMutability": "view",
                "type": "function",
              },
              {
                "inputs": [
                  {
                    "internalType": "uint256",
                    "name": "_tokenId",
                    "type": "uint256",
                  },
                ],
                "name": "uri",
                "outputs": [
                  {
                    "internalType": "string",
                    "name": "",
                    "type": "string",
                  },
                ],
                "stateMutability": "view",
                "type": "function",
              },
              {
                "inputs": [
                  {
                    "internalType": "address",
                    "name": "_claimer",
                    "type": "address",
                  },
                  {
                    "internalType": "uint256",
                    "name": "_tokenId",
                    "type": "uint256",
                  },
                  {
                    "internalType": "uint256",
                    "name": "_quantity",
                    "type": "uint256",
                  },
                ],
                "name": "verifyClaim",
                "outputs": [],
                "stateMutability": "view",
                "type": "function",
              },
            ],
            "devdoc": {
              "errors": {
                "BatchMintInvalidBatchId(uint256)": [
                  {
                    "details": "Invalid index for batch",
                  },
                ],
                "BatchMintInvalidTokenId(uint256)": [
                  {
                    "details": "Invalid token",
                  },
                ],
                "BatchMintMetadataFrozen(uint256)": [
                  {
                    "details": "Metadata frozen",
                  },
                ],
                "ContractMetadataUnauthorized()": [
                  {
                    "details": "The sender is not authorized to perform the action",
                  },
                ],
                "LazyMintUnauthorized()": [
                  {
                    "details": "The sender is not authorized to perform the action",
                  },
                ],
                "OwnableUnauthorized()": [
                  {
                    "details": "The sender is not authorized to perform the action",
                  },
                ],
                "RoyaltyExceededMaxFeeBps(uint256,uint256)": [
                  {
                    "details": "The fee bps exceeded the max value",
                  },
                ],
                "RoyaltyInvalidRecipient(address)": [
                  {
                    "details": "The recipient is invalid",
                  },
                ],
                "RoyaltyUnauthorized()": [
                  {
                    "details": "The sender is not authorized to perform the action",
                  },
                ],
              },
              "events": {
                "ApprovalForAll(address,address,bool)": {
                  "details": "MUST emit when approval for a second party/operator address to manage all tokens for an owner address is enabled or disabled (absense of an event assumes disabled).",
                },
                "ContractURIUpdated(string,string)": {
                  "details": "Emitted when the contract URI is updated.",
                },
                "DefaultRoyalty(address,uint256)": {
                  "details": "Emitted when royalty info is updated.",
                },
                "MetadataFrozen()": {
                  "details": "This event emits when the metadata of all tokens are frozen. While not currently supported by marketplaces, this event allows future indexing if desired.",
                },
                "OwnerUpdated(address,address)": {
                  "details": "Emitted when a new Owner is set.",
                },
                "RoyaltyForToken(uint256,address,uint256)": {
                  "details": "Emitted when royalty recipient for tokenId is set",
                },
                "TokensClaimed(address,address,uint256,uint256)": {
                  "details": "Emitted when tokens are claimed",
                },
                "TokensLazyMinted(uint256,uint256,string,bytes)": {
                  "details": "Emitted when tokens are lazy minted.",
                },
                "TransferBatch(address,address,address,uint256[],uint256[])": {
                  "details": "Either \`TransferSingle\` or \`TransferBatch\` MUST emit when tokens are transferred, including zero value transfers as well as minting or burning (see "Safe Transfer Rules" section of the standard). The \`_operator\` argument MUST be msg.sender. The \`_from\` argument MUST be the address of the holder whose balance is decreased. The \`_to\` argument MUST be the address of the recipient whose balance is increased. The \`_ids\` argument MUST be the list of tokens being transferred. The \`_values\` argument MUST be the list of number of tokens (matching the list and order of tokens specified in _ids) the holder balance is decreased by and match what the recipient balance is increased by. When minting/creating tokens, the \`_from\` argument MUST be set to \`0x0\` (i.e. zero address). When burning/destroying tokens, the \`_to\` argument MUST be set to \`0x0\` (i.e. zero address).",
                },
                "TransferSingle(address,address,address,uint256,uint256)": {
                  "details": "Either \`TransferSingle\` or \`TransferBatch\` MUST emit when tokens are transferred, including zero value transfers as well as minting or burning (see "Safe Transfer Rules" section of the standard). The \`_operator\` argument MUST be msg.sender. The \`_from\` argument MUST be the address of the holder whose balance is decreased. The \`_to\` argument MUST be the address of the recipient whose balance is increased. The \`_id\` argument MUST be the token type being transferred. The \`_value\` argument MUST be the number of tokens the holder balance is decreased by and match what the recipient balance is increased by. When minting/creating tokens, the \`_from\` argument MUST be set to \`0x0\` (i.e. zero address). When burning/destroying tokens, the \`_to\` argument MUST be set to \`0x0\` (i.e. zero address).",
                },
                "URI(string,uint256)": {
                  "details": "MUST emit when the URI is updated for a token ID. URIs are defined in RFC 3986. The URI MUST point a JSON file that conforms to the "ERC-1155 Metadata URI JSON Schema".",
                },
              },
              "kind": "dev",
              "methods": {
                "burnBatch(address,uint256[],uint256[])": {
                  "params": {
                    "_amounts": "The amounts of the NFTs to burn.",
                    "_owner": "The owner of the NFTs to burn.",
                    "_tokenIds": "The tokenIds of the NFTs to burn.",
                  },
                },
                "claim(address,uint256,uint256)": {
                  "details": "The logic in \`verifyClaim\` determines whether the caller is authorized to mint NFTs.                   The logic in \`transferTokensOnClaim\` does actual minting of tokens,                   can also be used to apply other state changes.",
                  "params": {
                    "_quantity": "The number of tokens to mint.",
                    "_receiver": "The recipient of the tokens to mint.",
                    "_tokenId": "The tokenId of the lazy minted NFT to mint.",
                  },
                },
                "getBaseURICount()": {
                  "details": "Each batch of tokens has an in ID and an associated \`baseURI\`.                  See {batchIds}.",
                },
                "getBatchIdAtIndex(uint256)": {
                  "details": "See {getBaseURICount}.",
                  "params": {
                    "_index": "Index of the desired batch in batchIds array.",
                  },
                },
                "getRoyaltyInfoForToken(uint256)": {
                  "details": "Returns royalty recipient and bps for \`_tokenId\`.",
                  "params": {
                    "_tokenId": "The tokenID of the NFT for which to query royalty info.",
                  },
                },
                "lazyMint(uint256,string,bytes)": {
                  "params": {
                    "_amount": "The number of NFTs to lazy mint.",
                    "_baseURIForTokens": "The base URI for the 'n' number of NFTs being lazy minted, where the metadata for each                           of those NFTs is \`\${baseURIForTokens}/\${tokenId}\`.",
                    "_data": "Additional bytes data to be used at the discretion of the consumer of the contract.",
                  },
                  "returns": {
                    "batchId": "         A unique integer identifier for the batch of NFTs lazy minted together.",
                  },
                },
                "multicall(bytes[])": {
                  "details": "Receives and executes a batch of function calls on this contract.",
                  "params": {
                    "data": "The bytes data that makes up the batch of function calls to execute.",
                  },
                  "returns": {
                    "results": "The bytes data that makes up the result of the batch of function calls executed.",
                  },
                },
                "royaltyInfo(uint256,uint256)": {
                  "details": "Returns royalty amount and recipient for \`tokenId\` and \`salePrice\`.",
                  "params": {
                    "salePrice": "Sale price of the token.",
                    "tokenId": "The tokenID of the NFT for which to query royalty info.",
                  },
                  "returns": {
                    "receiver": "       Address of royalty recipient account.",
                    "royaltyAmount": "  Royalty amount calculated at current royaltyBps value.",
                  },
                },
                "setContractURI(string)": {
                  "details": "Caller should be authorized to setup contractURI, e.g. contract admin.                  See {_canSetContractURI}.                  Emits {ContractURIUpdated Event}.",
                  "params": {
                    "_uri": "keccak256 hash of the role. e.g. keccak256("TRANSFER_ROLE")",
                  },
                },
                "setDefaultRoyaltyInfo(address,uint256)": {
                  "details": "Caller should be authorized to set royalty info.                  See {_canSetRoyaltyInfo}.                  Emits {DefaultRoyalty Event}; See {_setupDefaultRoyaltyInfo}.",
                  "params": {
                    "_royaltyBps": "Updated royalty bps.",
                    "_royaltyRecipient": "Address to be set as default royalty recipient.",
                  },
                },
                "setOwner(address)": {
                  "params": {
                    "_newOwner": "The address to set as the new owner of the contract.",
                  },
                },
                "setRoyaltyInfoForToken(uint256,address,uint256)": {
                  "details": "Sets royalty info for \`_tokenId\`. Caller should be authorized to set royalty info.                  See {_canSetRoyaltyInfo}.                  Emits {RoyaltyForToken Event}; See {_setupRoyaltyInfoForToken}.",
                  "params": {
                    "_bps": "Updated royalty bps for the token Id.",
                    "_recipient": "Address to be set as royalty recipient for given token Id.",
                  },
                },
                "supportsInterface(bytes4)": {
                  "details": "See ERC165: https://eips.ethereum.org/EIPS/eip-165",
                },
                "uri(uint256)": {
                  "params": {
                    "_tokenId": "The tokenId of the NFT.",
                  },
                  "returns": {
                    "_0": "The metadata URI for the given tokenId.",
                  },
                },
                "verifyClaim(address,uint256,uint256)": {
                  "details": "Checks a request to claim NFTs against a custom condition.",
                  "params": {
                    "_claimer": "Caller of the claim function.",
                    "_quantity": "The number of NFTs being claimed.",
                    "_tokenId": "The tokenId of the lazy minted NFT to mint.",
                  },
                },
              },
              "title": "CatAttackNFT - The game contract for https://catattacknft.vercel.app/",
              "version": 1,
            },
            "userdoc": {
              "events": {
                "BatchMetadataUpdate(uint256,uint256)": {
                  "notice": "So that the third-party platforms such as NFT market could timely update the images and related attributes of the NFTs.",
                },
              },
              "kind": "user",
              "methods": {
                "attack(address)": {
                  "notice": "Lets a Ninja cat owner attack another user's to burn their cats",
                },
                "balanceOf(address,uint256)": {
                  "notice": "Get the balance of an account's Tokens.",
                },
                "burn(address,uint256,uint256)": {
                  "notice": "Burn a cat to either level up or attack another cat",
                },
                "burnBatch(address,uint256[],uint256[])": {
                  "notice": "Lets an owner or approved operator burn NFTs of the given tokenIds.",
                },
                "claim(address,uint256,uint256)": {
                  "notice": "Lets an address claim multiple lazy minted NFTs at once to a recipient.                   This function prevents any reentrant calls, and is not allowed to be overridden.                   Contract creators should override \`verifyClaim\` and \`transferTokensOnClaim\`                   functions to create custom logic for verification and claiming,                   for e.g. price collection, allowlist, max quantity, etc.",
                },
                "claimKitten()": {
                  "notice": "Claim a kitten to start playing, but only if you don't already own a cat",
                },
                "contractURI()": {
                  "notice": "Returns the contract metadata URI.",
                },
                "getBaseURICount()": {
                  "notice": "Returns the count of batches of NFTs.",
                },
                "getBatchIdAtIndex(uint256)": {
                  "notice": "Returns the ID for the batch of tokens at the given index.",
                },
                "getDefaultRoyaltyInfo()": {
                  "notice": "Returns the defualt royalty recipient and BPS for this contract's NFTs.",
                },
                "getRoyaltyInfoForToken(uint256)": {
                  "notice": "View royalty info for a given token.",
                },
                "isApprovedForAll(address,address)": {
                  "notice": "Queries the approval status of an operator for a given owner.",
                },
                "lazyMint(uint256,string,bytes)": {
                  "notice": "Lets an authorized address lazy mint a given amount of NFTs.",
                },
                "multicall(bytes[])": {
                  "notice": "Receives and executes a batch of function calls on this contract.",
                },
                "nextTokenIdToMint()": {
                  "notice": "The tokenId assigned to the next new NFT to be lazy minted.",
                },
                "owner()": {
                  "notice": "Returns the owner of the contract.",
                },
                "royaltyInfo(uint256,uint256)": {
                  "notice": "View royalty info for a given token and sale price.",
                },
                "safeTransferFrom(address,address,uint256,uint256,bytes)": {
                  "notice": "Transfer cats to level up",
                },
                "setContractURI(string)": {
                  "notice": "Lets a contract admin set the URI for contract-level metadata.",
                },
                "setDefaultRoyaltyInfo(address,uint256)": {
                  "notice": "Updates default royalty recipient and bps.",
                },
                "setOwner(address)": {
                  "notice": "Lets an authorized wallet set a new owner for the contract.",
                },
                "setRoyaltyInfoForToken(uint256,address,uint256)": {
                  "notice": "Updates default royalty recipient and bps for a particular token.",
                },
                "startGame()": {
                  "notice": "Lets the owner restart the game",
                },
                "stopGame()": {
                  "notice": "Lets the owner pause the game",
                },
                "totalSupply(uint256)": {
                  "notice": "Returns the total supply of NFTs of a given tokenId",
                },
                "uri(uint256)": {
                  "notice": "Returns the metadata URI for the given tokenId.",
                },
                "verifyClaim(address,uint256,uint256)": {
                  "notice": "Override this function to add logic for claim verification, based on conditions                   such as allowlist, price, max quantity etc.",
                },
              },
              "version": 1,
            },
          },
          "settings": {
            "compilationTarget": {
              "src/CatAttackNFT.sol": "CatAttackNFT",
            },
            "evmVersion": "paris",
            "libraries": {},
            "metadata": {
              "bytecodeHash": "ipfs",
            },
            "optimizer": {
              "enabled": true,
              "runs": 200,
            },
            "remappings": [
              ":@chainlink/=lib/contracts/lib/chainlink/",
              ":@ds-test/=lib/contracts/lib/ds-test/src/",
              ":@openzeppelin/contracts-upgradeable/=lib/contracts/lib/openzeppelin-contracts-upgradeable/contracts/",
              ":@openzeppelin/contracts/=lib/contracts/lib/openzeppelin-contracts/contracts/",
              ":@rari-capital/solmate/=lib/contracts/lib/seaport/lib/solmate/",
              ":@seaport/=lib/contracts/lib/seaport/contracts/",
              ":@solady/=lib/contracts/lib/solady/",
              ":@std/=lib/contracts/lib/forge-std/src/",
              ":@thirdweb-dev/contracts/=lib/contracts/contracts/",
              ":@thirdweb-dev/dynamic-contracts/=lib/contracts/lib/dynamic-contracts/",
              ":ERC721A-Upgradeable/=lib/contracts/lib/ERC721A-Upgradeable/contracts/",
              ":ERC721A/=lib/contracts/lib/ERC721A/contracts/",
              ":chainlink/=lib/contracts/lib/chainlink/contracts/",
              ":contracts/=lib/contracts/contracts/",
              ":ds-test/=lib/contracts/lib/ds-test/src/",
              ":dynamic-contracts/=lib/contracts/lib/dynamic-contracts/src/",
              ":erc4626-tests/=lib/contracts/lib/openzeppelin-contracts-upgradeable/lib/erc4626-tests/",
              ":erc721a-upgradeable/=lib/contracts/lib/ERC721A-Upgradeable/",
              ":erc721a/=lib/contracts/lib/ERC721A/",
              ":forge-std/=lib/forge-std/src/",
              ":lib/sstore2/=lib/contracts/lib/dynamic-contracts/lib/sstore2/",
              ":murky/=lib/contracts/lib/murky/",
              ":openzeppelin-contracts-upgradeable/=lib/contracts/lib/openzeppelin-contracts-upgradeable/",
              ":openzeppelin-contracts/=lib/contracts/lib/openzeppelin-contracts/",
              ":openzeppelin/=lib/contracts/lib/openzeppelin-contracts-upgradeable/contracts/",
              ":seaport-core/=lib/contracts/lib/seaport-core/src/",
              ":seaport-sol/=lib/contracts/lib/seaport-sol/src/",
              ":seaport-types/=lib/contracts/lib/seaport-types/src/",
              ":seaport/=lib/contracts/lib/seaport/",
              ":solady/=lib/contracts/lib/solady/src/",
              ":solarray/=lib/contracts/lib/seaport/lib/solarray/src/",
              ":solmate/=lib/contracts/lib/seaport/lib/solmate/src/",
              ":sstore2/=lib/contracts/lib/dynamic-contracts/lib/sstore2/contracts/",
            ],
          },
          "sources": {
            "lib/contracts/contracts/base/ERC1155LazyMint.sol": {
              "keccak256": "0xdf81210defe226ea6a3bd3e986ca75ffd8d58010ba7bc3ed9f66657312ff69af",
              "license": "Apache-2.0",
              "urls": [
                "bzz-raw://0b0edac74c1b7b949bf2ef4093b465d1b7e7261bd4ae9ac0e6a055386bed7eae",
                "dweb:/ipfs/Qmf4S5enGdMGEgBGZ8FXpDmj82R7xixAD4LwGntJMSyBsJ",
              ],
            },
            "lib/contracts/contracts/eip/ERC1155.sol": {
              "keccak256": "0xbac4d98722f937b876908b0baf24ff2854e65da244412db4622064d87c63a752",
              "license": "Apache 2.0",
              "urls": [
                "bzz-raw://66af1bbb9833ad15656d41faafaf835fb98dec1a87554b143a3bb0e0eabe2fb3",
                "dweb:/ipfs/QmQUSxBYCT5VDvx4V5b4DX8gZyGgqSC42TKwYcd6CBZ2jf",
              ],
            },
            "lib/contracts/contracts/eip/interface/IERC1155.sol": {
              "keccak256": "0x19b9bee642c1b8e21c412a90fd08784dad7f567651edbe72bebf70d16551a2f4",
              "license": "Apache-2.0",
              "urls": [
                "bzz-raw://9c3f49fddb363032b69842d35cfc2aa72c8a36f3db2bed1e9bad3fc486b96df5",
                "dweb:/ipfs/QmQ5tn1fboZBmXWDXRfBMGJqYS9FtaQC8NYHaCiJapaJLF",
              ],
            },
            "lib/contracts/contracts/eip/interface/IERC1155Metadata.sol": {
              "keccak256": "0xe9d530111d75c5d6db4ca4f30dd76d6a29d9363ab7390e922942a0fc9e3ce32e",
              "license": "Apache-2.0",
              "urls": [
                "bzz-raw://8272be1ca643bd3038fd67b00acad09a8dca44536284bcca6b862d09f8b53e43",
                "dweb:/ipfs/Qme9wiWPDfh36xm7TNaxpAYxv5jAptMNLtYksRwc5zNFbU",
              ],
            },
            "lib/contracts/contracts/eip/interface/IERC1155Receiver.sol": {
              "keccak256": "0xfef511c703e7ebdb193d35a67e0d9b70728789b2ac45cc5cf5ee56c4ad034f00",
              "license": "MIT",
              "urls": [
                "bzz-raw://f838e560ba0caddc54ad4ba082e0ff3bf27a721c15bc0cf19791fef7940837a5",
                "dweb:/ipfs/QmTwfwYYK4Ky9PPhdDoVVmZJaJ7y2hZDH8YnBQRfiA8Baz",
              ],
            },
            "lib/contracts/contracts/eip/interface/IERC165.sol": {
              "keccak256": "0x35d0a916f70344a5fcc6c67cb531b6150d2fce43e72a6282385eab02020f2f49",
              "license": "MIT",
              "urls": [
                "bzz-raw://75ccd8b9a8b52a93b8097fcb8181b7afb6d72bbe6eaabf434f0481a7a207cc8a",
                "dweb:/ipfs/QmPUZAEE4nwkijcE2amAXAWEVGVG5XaKWGhpgnRwpAf93R",
              ],
            },
            "lib/contracts/contracts/eip/interface/IERC2981.sol": {
              "keccak256": "0x6a1ea21755c29a9f74e21176486902eb943f2f3aaa465b351b0c1b7c5794f5aa",
              "license": "Apache 2.0",
              "urls": [
                "bzz-raw://08d1accd523ed037c07d097fa2121597b00f02f0a0a5a5669a24a0924e4c01f6",
                "dweb:/ipfs/Qmem3H95uDQuACtgLC14PRWezwmvrwdjBKB4iY7Kz9LGiT",
              ],
            },
            "lib/contracts/contracts/extension/BatchMintMetadata.sol": {
              "keccak256": "0x97bf86276ecd830c41636c93b1aff2bd2271b5ca1e5b6ccd2813fbce240f96d1",
              "license": "Apache-2.0",
              "urls": [
                "bzz-raw://e6db0f351255c37e0a9cce1357b7adb93c321e16651d2ba1cefbc47e126e90a1",
                "dweb:/ipfs/QmfNpmBBU5K8N4aGV8kTHvdD1oaP8XiWekizvEDyfeGDMw",
              ],
            },
            "lib/contracts/contracts/extension/ContractMetadata.sol": {
              "keccak256": "0x0752a8a6eeb7e61acfe50e39344c16258a89cfaa55fc9db9289dc6e18ae7af66",
              "license": "Apache-2.0",
              "urls": [
                "bzz-raw://6ca1ffdbc96af19fa17e23fd8a1aebe2d5849e63ded33805228b26f1901125e8",
                "dweb:/ipfs/QmckQ7iwwm9LuywfpuYP7Y7AcUW8yNy1eDL741ug8w1wyv",
              ],
            },
            "lib/contracts/contracts/extension/LazyMint.sol": {
              "keccak256": "0x54403018bf34bae1a06be6692ea49c2694e969925a4ab55442089f99a902b6df",
              "license": "Apache-2.0",
              "urls": [
                "bzz-raw://395276b4c28c68abecc49c20b63d118ec40ad82769008124c07c8c0bb24cd1e4",
                "dweb:/ipfs/QmUNdwffH6msk4Cb9zcUdHbKUByiRNTZ9XfUD3DzPax7Nh",
              ],
            },
            "lib/contracts/contracts/extension/Multicall.sol": {
              "keccak256": "0xe4479833f6297a1461478733e14dd0e9b8376da474fa7067cb8937f9ccff2836",
              "license": "Apache 2.0",
              "urls": [
                "bzz-raw://b03c41daeba7783e04387eff65f6ccc50f2312d895ff3cb9198410976df19c4e",
                "dweb:/ipfs/QmV54V9YQn9TWZhoAsFex8GdCkQmFX6iajYnUv5zU1sxEQ",
              ],
            },
            "lib/contracts/contracts/extension/Ownable.sol": {
              "keccak256": "0xd5edceecc8eee7460707d4c078f8273e8e488ab76cd2dcfaab36bd48e7f8bfaa",
              "license": "Apache-2.0",
              "urls": [
                "bzz-raw://0e0a2692225385848e6b781dd54381e27d7287be46033a00b67d3c66d19bb1a3",
                "dweb:/ipfs/QmStFLkQwcpTtzNefx4yxNxmHbf4WdVSzkSNEN97vaWzyg",
              ],
            },
            "lib/contracts/contracts/extension/Royalty.sol": {
              "keccak256": "0x9516b9df33e19538638ce1f756bba1f992367ff02255c1d800ec4e6b3f2c7c74",
              "license": "Apache-2.0",
              "urls": [
                "bzz-raw://cc726a319d2c55401dc0cba508d3d1057c3a793a56ea757ab51a44bcaa3e63ae",
                "dweb:/ipfs/QmaREGBvNt1wEUrJiLPkspyZieyg899K4ceCrrcRPuHRZg",
              ],
            },
            "lib/contracts/contracts/extension/interface/IClaimableERC1155.sol": {
              "keccak256": "0x3fdfdad356fdd98e5dd1ec1f65d921c696b44bd9505f92a8440ad2430cfbb48c",
              "license": "Apache-2.0",
              "urls": [
                "bzz-raw://bbc4177861066675e9e13caeead661f9003553c22edf1e4d5ed43062f497b52b",
                "dweb:/ipfs/QmPWERVCFoaCKkBnSNetX1YDhF7VtDVK6yEVYruubZRE1Q",
              ],
            },
            "lib/contracts/contracts/extension/interface/IContractMetadata.sol": {
              "keccak256": "0x41d3f7f43c124e9ff0247cb94f4e8fc8c5a79b1de331c67eb03654154248d7f2",
              "license": "Apache-2.0",
              "urls": [
                "bzz-raw://fa8d6251cf3a876193cc719b456c02ff23d3f2d5486431e9bdaf290be9a4ce9a",
                "dweb:/ipfs/QmRwnA2q15Vdkc66fz6BAinZM3tjuVNHn5CeGzc7ZFMAzr",
              ],
            },
            "lib/contracts/contracts/extension/interface/ILazyMint.sol": {
              "keccak256": "0x480953502a40e438d855392e322adc0369e2109f6d46fb9ec2bb3ad0afbb0aec",
              "license": "Apache-2.0",
              "urls": [
                "bzz-raw://2b3bb332d4f5e38f9786b00564ad417e48c689b4a92a60888c3845b986c995a3",
                "dweb:/ipfs/QmPVM4KTUeLD7uVCfP8MBQNRo7pU8xF3rXQuDcx3C6cLxA",
              ],
            },
            "lib/contracts/contracts/extension/interface/IMulticall.sol": {
              "keccak256": "0xe2bbd37b8fdb9cc8b933e598512a068ebb214b3f5abc2bc634916def55be4ef3",
              "license": "MIT",
              "urls": [
                "bzz-raw://012352099c262348ac755a53b082af520babc6c66dc5f1251fc23609728340ca",
                "dweb:/ipfs/QmcXEgzQ53jdJX5ZNy8zivvUjDq7J8WTnR1yAiwTpkQ2ar",
              ],
            },
            "lib/contracts/contracts/extension/interface/IOwnable.sol": {
              "keccak256": "0xd659a64da6264fdd50ee379be032fea4917eba4fadfd6d366107fb17e46907f3",
              "license": "Apache-2.0",
              "urls": [
                "bzz-raw://c15940c4a3d229f4fdd1226fe297a58fde10b07b86a34de1ed11a8802dd5dea9",
                "dweb:/ipfs/QmS8p8CxWiahLkYsCWNhFjCnmQzuc4ck3kjYYuCFj8LsmC",
              ],
            },
            "lib/contracts/contracts/extension/interface/IRoyalty.sol": {
              "keccak256": "0x06f66ba14674e2396219fb361486d43e6059933114a54c26b6e01dc3bf794f0d",
              "license": "Apache-2.0",
              "urls": [
                "bzz-raw://ad01c637bda34a7c8e75d9e0b7412f5817bfc547754eb49e990406294de9531e",
                "dweb:/ipfs/QmRBqte5ir3T9Rew3YXn5v6otp7LMq48H4MxRhuQ4nyqqd",
              ],
            },
            "lib/contracts/contracts/external-deps/openzeppelin/security/ReentrancyGuard.sol": {
              "keccak256": "0x2030bba0e41fb3daead24cdba39cd9d8ce2748de68e57f1c811420419a739afb",
              "license": "MIT",
              "urls": [
                "bzz-raw://1a64e19e10d66555abcf0b5392bb27f9e65f674d7688761f02f2c8b508490623",
                "dweb:/ipfs/QmNhMchAD6kuHFAAgdwCwuNUS3uaUD2gwofT5kxQAQeWH6",
              ],
            },
            "lib/contracts/contracts/lib/Address.sol": {
              "keccak256": "0xa1e2c06c07422ce6f27ab1c4d4ce62bdc3200e082b735b5e3a75c2e7b61cbc4f",
              "license": "Apache-2.0",
              "urls": [
                "bzz-raw://cc90229c980f78c582a05386d4621172c7d20dec9ad528a5bf1d59b243fff0a5",
                "dweb:/ipfs/QmcZZLaZ9XU1gWj7b9EBZftPoED3pKEvvFGhS5yBvtMPtn",
              ],
            },
            "lib/contracts/contracts/lib/Strings.sol": {
              "keccak256": "0xd8fcca4db8f1678a124ae0d3b4da6c29e9737e5ae03f90f18b84261ae4499568",
              "license": "Apache-2.0",
              "urls": [
                "bzz-raw://ed0d23694c31613645904cc5d6f3e08ecd34063aeb5bd23ebc9a8223a67f91fb",
                "dweb:/ipfs/QmTf9WBdvzU2dDDTqeSn1g85AkXTe8MfN1pdyaVzm15Cdb",
              ],
            },
            "src/CatAttackNFT.sol": {
              "keccak256": "0xa4daadfa5c2bee9cc6a1e906e5b1f3fc82d722488794cf9d3b4b9db3667dc6c8",
              "license": "Apache-2.0",
              "urls": [
                "bzz-raw://d548332c72234abc0467a821bb6d371f070201306866d1f3f089f230dcc91b5c",
                "dweb:/ipfs/QmWvVuxyPgSGad9SSXJ2UwTjkAwpFPpXtTL1N1Jzd1St1X",
              ],
            },
          },
          "version": 1,
        },
        "metadataUri": "ipfs://Qmd2Ef29NzCjomqYXZbWa8ZdF1AESDAS1HDAonmAnTgHPs",
        "name": "CatAttackNFT",
        "output": {
          "abi": [
            {
              "inputs": [
                {
                  "internalType": "string",
                  "name": "_name",
                  "type": "string",
                },
                {
                  "internalType": "string",
                  "name": "_symbol",
                  "type": "string",
                },
              ],
              "stateMutability": "nonpayable",
              "type": "constructor",
            },
            {
              "inputs": [
                {
                  "internalType": "uint256",
                  "name": "index",
                  "type": "uint256",
                },
              ],
              "name": "BatchMintInvalidBatchId",
              "type": "error",
            },
            {
              "inputs": [
                {
                  "internalType": "uint256",
                  "name": "tokenId",
                  "type": "uint256",
                },
              ],
              "name": "BatchMintInvalidTokenId",
              "type": "error",
            },
            {
              "inputs": [
                {
                  "internalType": "uint256",
                  "name": "batchId",
                  "type": "uint256",
                },
              ],
              "name": "BatchMintMetadataFrozen",
              "type": "error",
            },
            {
              "inputs": [],
              "name": "ContractMetadataUnauthorized",
              "type": "error",
            },
            {
              "inputs": [],
              "name": "LazyMintInvalidAmount",
              "type": "error",
            },
            {
              "inputs": [],
              "name": "LazyMintUnauthorized",
              "type": "error",
            },
            {
              "inputs": [],
              "name": "OwnableUnauthorized",
              "type": "error",
            },
            {
              "inputs": [
                {
                  "internalType": "uint256",
                  "name": "max",
                  "type": "uint256",
                },
                {
                  "internalType": "uint256",
                  "name": "actual",
                  "type": "uint256",
                },
              ],
              "name": "RoyaltyExceededMaxFeeBps",
              "type": "error",
            },
            {
              "inputs": [
                {
                  "internalType": "address",
                  "name": "recipient",
                  "type": "address",
                },
              ],
              "name": "RoyaltyInvalidRecipient",
              "type": "error",
            },
            {
              "inputs": [],
              "name": "RoyaltyUnauthorized",
              "type": "error",
            },
            {
              "anonymous": false,
              "inputs": [
                {
                  "indexed": true,
                  "internalType": "address",
                  "name": "_owner",
                  "type": "address",
                },
                {
                  "indexed": true,
                  "internalType": "address",
                  "name": "_operator",
                  "type": "address",
                },
                {
                  "indexed": false,
                  "internalType": "bool",
                  "name": "_approved",
                  "type": "bool",
                },
              ],
              "name": "ApprovalForAll",
              "type": "event",
            },
            {
              "anonymous": false,
              "inputs": [
                {
                  "indexed": false,
                  "internalType": "uint256",
                  "name": "_fromTokenId",
                  "type": "uint256",
                },
                {
                  "indexed": false,
                  "internalType": "uint256",
                  "name": "_toTokenId",
                  "type": "uint256",
                },
              ],
              "name": "BatchMetadataUpdate",
              "type": "event",
            },
            {
              "anonymous": false,
              "inputs": [
                {
                  "indexed": false,
                  "internalType": "string",
                  "name": "prevURI",
                  "type": "string",
                },
                {
                  "indexed": false,
                  "internalType": "string",
                  "name": "newURI",
                  "type": "string",
                },
              ],
              "name": "ContractURIUpdated",
              "type": "event",
            },
            {
              "anonymous": false,
              "inputs": [
                {
                  "indexed": true,
                  "internalType": "address",
                  "name": "newRoyaltyRecipient",
                  "type": "address",
                },
                {
                  "indexed": false,
                  "internalType": "uint256",
                  "name": "newRoyaltyBps",
                  "type": "uint256",
                },
              ],
              "name": "DefaultRoyalty",
              "type": "event",
            },
            {
              "anonymous": false,
              "inputs": [
                {
                  "indexed": true,
                  "internalType": "address",
                  "name": "account",
                  "type": "address",
                },
                {
                  "indexed": false,
                  "internalType": "uint256",
                  "name": "level",
                  "type": "uint256",
                },
              ],
              "name": "LevelUp",
              "type": "event",
            },
            {
              "anonymous": false,
              "inputs": [],
              "name": "MetadataFrozen",
              "type": "event",
            },
            {
              "anonymous": false,
              "inputs": [
                {
                  "indexed": true,
                  "internalType": "address",
                  "name": "attacker",
                  "type": "address",
                },
                {
                  "indexed": true,
                  "internalType": "address",
                  "name": "victim",
                  "type": "address",
                },
                {
                  "indexed": false,
                  "internalType": "uint256",
                  "name": "level",
                  "type": "uint256",
                },
              ],
              "name": "Miaowed",
              "type": "event",
            },
            {
              "anonymous": false,
              "inputs": [
                {
                  "indexed": true,
                  "internalType": "address",
                  "name": "prevOwner",
                  "type": "address",
                },
                {
                  "indexed": true,
                  "internalType": "address",
                  "name": "newOwner",
                  "type": "address",
                },
              ],
              "name": "OwnerUpdated",
              "type": "event",
            },
            {
              "anonymous": false,
              "inputs": [
                {
                  "indexed": true,
                  "internalType": "uint256",
                  "name": "tokenId",
                  "type": "uint256",
                },
                {
                  "indexed": true,
                  "internalType": "address",
                  "name": "royaltyRecipient",
                  "type": "address",
                },
                {
                  "indexed": false,
                  "internalType": "uint256",
                  "name": "royaltyBps",
                  "type": "uint256",
                },
              ],
              "name": "RoyaltyForToken",
              "type": "event",
            },
            {
              "anonymous": false,
              "inputs": [
                {
                  "indexed": true,
                  "internalType": "address",
                  "name": "claimer",
                  "type": "address",
                },
                {
                  "indexed": true,
                  "internalType": "address",
                  "name": "receiver",
                  "type": "address",
                },
                {
                  "indexed": true,
                  "internalType": "uint256",
                  "name": "tokenId",
                  "type": "uint256",
                },
                {
                  "indexed": false,
                  "internalType": "uint256",
                  "name": "quantityClaimed",
                  "type": "uint256",
                },
              ],
              "name": "TokensClaimed",
              "type": "event",
            },
            {
              "anonymous": false,
              "inputs": [
                {
                  "indexed": true,
                  "internalType": "uint256",
                  "name": "startTokenId",
                  "type": "uint256",
                },
                {
                  "indexed": false,
                  "internalType": "uint256",
                  "name": "endTokenId",
                  "type": "uint256",
                },
                {
                  "indexed": false,
                  "internalType": "string",
                  "name": "baseURI",
                  "type": "string",
                },
                {
                  "indexed": false,
                  "internalType": "bytes",
                  "name": "encryptedBaseURI",
                  "type": "bytes",
                },
              ],
              "name": "TokensLazyMinted",
              "type": "event",
            },
            {
              "anonymous": false,
              "inputs": [
                {
                  "indexed": true,
                  "internalType": "address",
                  "name": "_operator",
                  "type": "address",
                },
                {
                  "indexed": true,
                  "internalType": "address",
                  "name": "_from",
                  "type": "address",
                },
                {
                  "indexed": true,
                  "internalType": "address",
                  "name": "_to",
                  "type": "address",
                },
                {
                  "indexed": false,
                  "internalType": "uint256[]",
                  "name": "_ids",
                  "type": "uint256[]",
                },
                {
                  "indexed": false,
                  "internalType": "uint256[]",
                  "name": "_values",
                  "type": "uint256[]",
                },
              ],
              "name": "TransferBatch",
              "type": "event",
            },
            {
              "anonymous": false,
              "inputs": [
                {
                  "indexed": true,
                  "internalType": "address",
                  "name": "_operator",
                  "type": "address",
                },
                {
                  "indexed": true,
                  "internalType": "address",
                  "name": "_from",
                  "type": "address",
                },
                {
                  "indexed": true,
                  "internalType": "address",
                  "name": "_to",
                  "type": "address",
                },
                {
                  "indexed": false,
                  "internalType": "uint256",
                  "name": "_id",
                  "type": "uint256",
                },
                {
                  "indexed": false,
                  "internalType": "uint256",
                  "name": "_value",
                  "type": "uint256",
                },
              ],
              "name": "TransferSingle",
              "type": "event",
            },
            {
              "anonymous": false,
              "inputs": [
                {
                  "indexed": false,
                  "internalType": "string",
                  "name": "_value",
                  "type": "string",
                },
                {
                  "indexed": true,
                  "internalType": "uint256",
                  "name": "_id",
                  "type": "uint256",
                },
              ],
              "name": "URI",
              "type": "event",
            },
            {
              "inputs": [
                {
                  "internalType": "address",
                  "name": "victim",
                  "type": "address",
                },
              ],
              "name": "attack",
              "outputs": [],
              "stateMutability": "nonpayable",
              "type": "function",
            },
            {
              "inputs": [
                {
                  "internalType": "address",
                  "name": "",
                  "type": "address",
                },
                {
                  "internalType": "uint256",
                  "name": "",
                  "type": "uint256",
                },
              ],
              "name": "balanceOf",
              "outputs": [
                {
                  "internalType": "uint256",
                  "name": "",
                  "type": "uint256",
                },
              ],
              "stateMutability": "view",
              "type": "function",
            },
            {
              "inputs": [
                {
                  "internalType": "address[]",
                  "name": "accounts",
                  "type": "address[]",
                },
                {
                  "internalType": "uint256[]",
                  "name": "ids",
                  "type": "uint256[]",
                },
              ],
              "name": "balanceOfBatch",
              "outputs": [
                {
                  "internalType": "uint256[]",
                  "name": "",
                  "type": "uint256[]",
                },
              ],
              "stateMutability": "view",
              "type": "function",
            },
            {
              "inputs": [
                {
                  "internalType": "uint256",
                  "name": "",
                  "type": "uint256",
                },
              ],
              "name": "batchFrozen",
              "outputs": [
                {
                  "internalType": "bool",
                  "name": "",
                  "type": "bool",
                },
              ],
              "stateMutability": "view",
              "type": "function",
            },
            {
              "inputs": [
                {
                  "internalType": "address",
                  "name": "account",
                  "type": "address",
                },
                {
                  "internalType": "uint256",
                  "name": "id",
                  "type": "uint256",
                },
                {
                  "internalType": "uint256",
                  "name": "amount",
                  "type": "uint256",
                },
              ],
              "name": "burn",
              "outputs": [],
              "stateMutability": "nonpayable",
              "type": "function",
            },
            {
              "inputs": [
                {
                  "internalType": "address",
                  "name": "_owner",
                  "type": "address",
                },
                {
                  "internalType": "uint256[]",
                  "name": "_tokenIds",
                  "type": "uint256[]",
                },
                {
                  "internalType": "uint256[]",
                  "name": "_amounts",
                  "type": "uint256[]",
                },
              ],
              "name": "burnBatch",
              "outputs": [],
              "stateMutability": "nonpayable",
              "type": "function",
            },
            {
              "inputs": [
                {
                  "internalType": "address",
                  "name": "_receiver",
                  "type": "address",
                },
                {
                  "internalType": "uint256",
                  "name": "_tokenId",
                  "type": "uint256",
                },
                {
                  "internalType": "uint256",
                  "name": "_quantity",
                  "type": "uint256",
                },
              ],
              "name": "claim",
              "outputs": [],
              "stateMutability": "payable",
              "type": "function",
            },
            {
              "inputs": [],
              "name": "claimKitten",
              "outputs": [],
              "stateMutability": "nonpayable",
              "type": "function",
            },
            {
              "inputs": [],
              "name": "contractURI",
              "outputs": [
                {
                  "internalType": "string",
                  "name": "",
                  "type": "string",
                },
              ],
              "stateMutability": "view",
              "type": "function",
            },
            {
              "inputs": [],
              "name": "getBaseURICount",
              "outputs": [
                {
                  "internalType": "uint256",
                  "name": "",
                  "type": "uint256",
                },
              ],
              "stateMutability": "view",
              "type": "function",
            },
            {
              "inputs": [
                {
                  "internalType": "uint256",
                  "name": "_index",
                  "type": "uint256",
                },
              ],
              "name": "getBatchIdAtIndex",
              "outputs": [
                {
                  "internalType": "uint256",
                  "name": "",
                  "type": "uint256",
                },
              ],
              "stateMutability": "view",
              "type": "function",
            },
            {
              "inputs": [],
              "name": "getDefaultRoyaltyInfo",
              "outputs": [
                {
                  "internalType": "address",
                  "name": "",
                  "type": "address",
                },
                {
                  "internalType": "uint16",
                  "name": "",
                  "type": "uint16",
                },
              ],
              "stateMutability": "view",
              "type": "function",
            },
            {
              "inputs": [
                {
                  "internalType": "uint256",
                  "name": "_tokenId",
                  "type": "uint256",
                },
              ],
              "name": "getRoyaltyInfoForToken",
              "outputs": [
                {
                  "internalType": "address",
                  "name": "",
                  "type": "address",
                },
                {
                  "internalType": "uint16",
                  "name": "",
                  "type": "uint16",
                },
              ],
              "stateMutability": "view",
              "type": "function",
            },
            {
              "inputs": [
                {
                  "internalType": "address",
                  "name": "player",
                  "type": "address",
                },
              ],
              "name": "getScore",
              "outputs": [
                {
                  "internalType": "uint256",
                  "name": "",
                  "type": "uint256",
                },
              ],
              "stateMutability": "view",
              "type": "function",
            },
            {
              "inputs": [
                {
                  "internalType": "address",
                  "name": "",
                  "type": "address",
                },
                {
                  "internalType": "address",
                  "name": "",
                  "type": "address",
                },
              ],
              "name": "isApprovedForAll",
              "outputs": [
                {
                  "internalType": "bool",
                  "name": "",
                  "type": "bool",
                },
              ],
              "stateMutability": "view",
              "type": "function",
            },
            {
              "inputs": [],
              "name": "isGamePaused",
              "outputs": [
                {
                  "internalType": "bool",
                  "name": "",
                  "type": "bool",
                },
              ],
              "stateMutability": "view",
              "type": "function",
            },
            {
              "inputs": [
                {
                  "internalType": "uint256",
                  "name": "_amount",
                  "type": "uint256",
                },
                {
                  "internalType": "string",
                  "name": "_baseURIForTokens",
                  "type": "string",
                },
                {
                  "internalType": "bytes",
                  "name": "_data",
                  "type": "bytes",
                },
              ],
              "name": "lazyMint",
              "outputs": [
                {
                  "internalType": "uint256",
                  "name": "batchId",
                  "type": "uint256",
                },
              ],
              "stateMutability": "nonpayable",
              "type": "function",
            },
            {
              "inputs": [
                {
                  "internalType": "bytes[]",
                  "name": "data",
                  "type": "bytes[]",
                },
              ],
              "name": "multicall",
              "outputs": [
                {
                  "internalType": "bytes[]",
                  "name": "results",
                  "type": "bytes[]",
                },
              ],
              "stateMutability": "nonpayable",
              "type": "function",
            },
            {
              "inputs": [],
              "name": "name",
              "outputs": [
                {
                  "internalType": "string",
                  "name": "",
                  "type": "string",
                },
              ],
              "stateMutability": "view",
              "type": "function",
            },
            {
              "inputs": [],
              "name": "nextTokenIdToMint",
              "outputs": [
                {
                  "internalType": "uint256",
                  "name": "",
                  "type": "uint256",
                },
              ],
              "stateMutability": "view",
              "type": "function",
            },
            {
              "inputs": [],
              "name": "owner",
              "outputs": [
                {
                  "internalType": "address",
                  "name": "",
                  "type": "address",
                },
              ],
              "stateMutability": "view",
              "type": "function",
            },
            {
              "inputs": [
                {
                  "internalType": "uint256",
                  "name": "tokenId",
                  "type": "uint256",
                },
                {
                  "internalType": "uint256",
                  "name": "salePrice",
                  "type": "uint256",
                },
              ],
              "name": "royaltyInfo",
              "outputs": [
                {
                  "internalType": "address",
                  "name": "receiver",
                  "type": "address",
                },
                {
                  "internalType": "uint256",
                  "name": "royaltyAmount",
                  "type": "uint256",
                },
              ],
              "stateMutability": "view",
              "type": "function",
            },
            {
              "inputs": [
                {
                  "internalType": "address",
                  "name": "from",
                  "type": "address",
                },
                {
                  "internalType": "address",
                  "name": "to",
                  "type": "address",
                },
                {
                  "internalType": "uint256[]",
                  "name": "ids",
                  "type": "uint256[]",
                },
                {
                  "internalType": "uint256[]",
                  "name": "amounts",
                  "type": "uint256[]",
                },
                {
                  "internalType": "bytes",
                  "name": "data",
                  "type": "bytes",
                },
              ],
              "name": "safeBatchTransferFrom",
              "outputs": [],
              "stateMutability": "nonpayable",
              "type": "function",
            },
            {
              "inputs": [
                {
                  "internalType": "address",
                  "name": "from",
                  "type": "address",
                },
                {
                  "internalType": "address",
                  "name": "to",
                  "type": "address",
                },
                {
                  "internalType": "uint256",
                  "name": "id",
                  "type": "uint256",
                },
                {
                  "internalType": "uint256",
                  "name": "amount",
                  "type": "uint256",
                },
                {
                  "internalType": "bytes",
                  "name": "data",
                  "type": "bytes",
                },
              ],
              "name": "safeTransferFrom",
              "outputs": [],
              "stateMutability": "nonpayable",
              "type": "function",
            },
            {
              "inputs": [
                {
                  "internalType": "address",
                  "name": "operator",
                  "type": "address",
                },
                {
                  "internalType": "bool",
                  "name": "approved",
                  "type": "bool",
                },
              ],
              "name": "setApprovalForAll",
              "outputs": [],
              "stateMutability": "nonpayable",
              "type": "function",
            },
            {
              "inputs": [
                {
                  "internalType": "string",
                  "name": "_uri",
                  "type": "string",
                },
              ],
              "name": "setContractURI",
              "outputs": [],
              "stateMutability": "nonpayable",
              "type": "function",
            },
            {
              "inputs": [
                {
                  "internalType": "address",
                  "name": "_royaltyRecipient",
                  "type": "address",
                },
                {
                  "internalType": "uint256",
                  "name": "_royaltyBps",
                  "type": "uint256",
                },
              ],
              "name": "setDefaultRoyaltyInfo",
              "outputs": [],
              "stateMutability": "nonpayable",
              "type": "function",
            },
            {
              "inputs": [
                {
                  "internalType": "address",
                  "name": "_newOwner",
                  "type": "address",
                },
              ],
              "name": "setOwner",
              "outputs": [],
              "stateMutability": "nonpayable",
              "type": "function",
            },
            {
              "inputs": [
                {
                  "internalType": "uint256",
                  "name": "_tokenId",
                  "type": "uint256",
                },
                {
                  "internalType": "address",
                  "name": "_recipient",
                  "type": "address",
                },
                {
                  "internalType": "uint256",
                  "name": "_bps",
                  "type": "uint256",
                },
              ],
              "name": "setRoyaltyInfoForToken",
              "outputs": [],
              "stateMutability": "nonpayable",
              "type": "function",
            },
            {
              "inputs": [],
              "name": "startGame",
              "outputs": [],
              "stateMutability": "nonpayable",
              "type": "function",
            },
            {
              "inputs": [],
              "name": "stopGame",
              "outputs": [],
              "stateMutability": "nonpayable",
              "type": "function",
            },
            {
              "inputs": [
                {
                  "internalType": "bytes4",
                  "name": "interfaceId",
                  "type": "bytes4",
                },
              ],
              "name": "supportsInterface",
              "outputs": [
                {
                  "internalType": "bool",
                  "name": "",
                  "type": "bool",
                },
              ],
              "stateMutability": "view",
              "type": "function",
            },
            {
              "inputs": [],
              "name": "symbol",
              "outputs": [
                {
                  "internalType": "string",
                  "name": "",
                  "type": "string",
                },
              ],
              "stateMutability": "view",
              "type": "function",
            },
            {
              "inputs": [
                {
                  "internalType": "uint256",
                  "name": "",
                  "type": "uint256",
                },
              ],
              "name": "totalSupply",
              "outputs": [
                {
                  "internalType": "uint256",
                  "name": "",
                  "type": "uint256",
                },
              ],
              "stateMutability": "view",
              "type": "function",
            },
            {
              "inputs": [
                {
                  "internalType": "uint256",
                  "name": "_tokenId",
                  "type": "uint256",
                },
              ],
              "name": "uri",
              "outputs": [
                {
                  "internalType": "string",
                  "name": "",
                  "type": "string",
                },
              ],
              "stateMutability": "view",
              "type": "function",
            },
            {
              "inputs": [
                {
                  "internalType": "address",
                  "name": "_claimer",
                  "type": "address",
                },
                {
                  "internalType": "uint256",
                  "name": "_tokenId",
                  "type": "uint256",
                },
                {
                  "internalType": "uint256",
                  "name": "_quantity",
                  "type": "uint256",
                },
              ],
              "name": "verifyClaim",
              "outputs": [],
              "stateMutability": "view",
              "type": "function",
            },
          ],
          "devdoc": {
            "errors": {
              "BatchMintInvalidBatchId(uint256)": [
                {
                  "details": "Invalid index for batch",
                },
              ],
              "BatchMintInvalidTokenId(uint256)": [
                {
                  "details": "Invalid token",
                },
              ],
              "BatchMintMetadataFrozen(uint256)": [
                {
                  "details": "Metadata frozen",
                },
              ],
              "ContractMetadataUnauthorized()": [
                {
                  "details": "The sender is not authorized to perform the action",
                },
              ],
              "LazyMintUnauthorized()": [
                {
                  "details": "The sender is not authorized to perform the action",
                },
              ],
              "OwnableUnauthorized()": [
                {
                  "details": "The sender is not authorized to perform the action",
                },
              ],
              "RoyaltyExceededMaxFeeBps(uint256,uint256)": [
                {
                  "details": "The fee bps exceeded the max value",
                },
              ],
              "RoyaltyInvalidRecipient(address)": [
                {
                  "details": "The recipient is invalid",
                },
              ],
              "RoyaltyUnauthorized()": [
                {
                  "details": "The sender is not authorized to perform the action",
                },
              ],
            },
            "events": {
              "ApprovalForAll(address,address,bool)": {
                "details": "MUST emit when approval for a second party/operator address to manage all tokens for an owner address is enabled or disabled (absense of an event assumes disabled).",
              },
              "ContractURIUpdated(string,string)": {
                "details": "Emitted when the contract URI is updated.",
              },
              "DefaultRoyalty(address,uint256)": {
                "details": "Emitted when royalty info is updated.",
              },
              "MetadataFrozen()": {
                "details": "This event emits when the metadata of all tokens are frozen. While not currently supported by marketplaces, this event allows future indexing if desired.",
              },
              "OwnerUpdated(address,address)": {
                "details": "Emitted when a new Owner is set.",
              },
              "RoyaltyForToken(uint256,address,uint256)": {
                "details": "Emitted when royalty recipient for tokenId is set",
              },
              "TokensClaimed(address,address,uint256,uint256)": {
                "details": "Emitted when tokens are claimed",
              },
              "TokensLazyMinted(uint256,uint256,string,bytes)": {
                "details": "Emitted when tokens are lazy minted.",
              },
              "TransferBatch(address,address,address,uint256[],uint256[])": {
                "details": "Either \`TransferSingle\` or \`TransferBatch\` MUST emit when tokens are transferred, including zero value transfers as well as minting or burning (see "Safe Transfer Rules" section of the standard). The \`_operator\` argument MUST be msg.sender. The \`_from\` argument MUST be the address of the holder whose balance is decreased. The \`_to\` argument MUST be the address of the recipient whose balance is increased. The \`_ids\` argument MUST be the list of tokens being transferred. The \`_values\` argument MUST be the list of number of tokens (matching the list and order of tokens specified in _ids) the holder balance is decreased by and match what the recipient balance is increased by. When minting/creating tokens, the \`_from\` argument MUST be set to \`0x0\` (i.e. zero address). When burning/destroying tokens, the \`_to\` argument MUST be set to \`0x0\` (i.e. zero address).",
              },
              "TransferSingle(address,address,address,uint256,uint256)": {
                "details": "Either \`TransferSingle\` or \`TransferBatch\` MUST emit when tokens are transferred, including zero value transfers as well as minting or burning (see "Safe Transfer Rules" section of the standard). The \`_operator\` argument MUST be msg.sender. The \`_from\` argument MUST be the address of the holder whose balance is decreased. The \`_to\` argument MUST be the address of the recipient whose balance is increased. The \`_id\` argument MUST be the token type being transferred. The \`_value\` argument MUST be the number of tokens the holder balance is decreased by and match what the recipient balance is increased by. When minting/creating tokens, the \`_from\` argument MUST be set to \`0x0\` (i.e. zero address). When burning/destroying tokens, the \`_to\` argument MUST be set to \`0x0\` (i.e. zero address).",
              },
              "URI(string,uint256)": {
                "details": "MUST emit when the URI is updated for a token ID. URIs are defined in RFC 3986. The URI MUST point a JSON file that conforms to the "ERC-1155 Metadata URI JSON Schema".",
              },
            },
            "kind": "dev",
            "methods": {
              "burnBatch(address,uint256[],uint256[])": {
                "params": {
                  "_amounts": "The amounts of the NFTs to burn.",
                  "_owner": "The owner of the NFTs to burn.",
                  "_tokenIds": "The tokenIds of the NFTs to burn.",
                },
              },
              "claim(address,uint256,uint256)": {
                "details": "The logic in \`verifyClaim\` determines whether the caller is authorized to mint NFTs.                   The logic in \`transferTokensOnClaim\` does actual minting of tokens,                   can also be used to apply other state changes.",
                "params": {
                  "_quantity": "The number of tokens to mint.",
                  "_receiver": "The recipient of the tokens to mint.",
                  "_tokenId": "The tokenId of the lazy minted NFT to mint.",
                },
              },
              "getBaseURICount()": {
                "details": "Each batch of tokens has an in ID and an associated \`baseURI\`.                  See {batchIds}.",
              },
              "getBatchIdAtIndex(uint256)": {
                "details": "See {getBaseURICount}.",
                "params": {
                  "_index": "Index of the desired batch in batchIds array.",
                },
              },
              "getRoyaltyInfoForToken(uint256)": {
                "details": "Returns royalty recipient and bps for \`_tokenId\`.",
                "params": {
                  "_tokenId": "The tokenID of the NFT for which to query royalty info.",
                },
              },
              "lazyMint(uint256,string,bytes)": {
                "params": {
                  "_amount": "The number of NFTs to lazy mint.",
                  "_baseURIForTokens": "The base URI for the 'n' number of NFTs being lazy minted, where the metadata for each                           of those NFTs is \`\${baseURIForTokens}/\${tokenId}\`.",
                  "_data": "Additional bytes data to be used at the discretion of the consumer of the contract.",
                },
                "returns": {
                  "batchId": "         A unique integer identifier for the batch of NFTs lazy minted together.",
                },
              },
              "multicall(bytes[])": {
                "details": "Receives and executes a batch of function calls on this contract.",
                "params": {
                  "data": "The bytes data that makes up the batch of function calls to execute.",
                },
                "returns": {
                  "results": "The bytes data that makes up the result of the batch of function calls executed.",
                },
              },
              "royaltyInfo(uint256,uint256)": {
                "details": "Returns royalty amount and recipient for \`tokenId\` and \`salePrice\`.",
                "params": {
                  "salePrice": "Sale price of the token.",
                  "tokenId": "The tokenID of the NFT for which to query royalty info.",
                },
                "returns": {
                  "receiver": "       Address of royalty recipient account.",
                  "royaltyAmount": "  Royalty amount calculated at current royaltyBps value.",
                },
              },
              "setContractURI(string)": {
                "details": "Caller should be authorized to setup contractURI, e.g. contract admin.                  See {_canSetContractURI}.                  Emits {ContractURIUpdated Event}.",
                "params": {
                  "_uri": "keccak256 hash of the role. e.g. keccak256("TRANSFER_ROLE")",
                },
              },
              "setDefaultRoyaltyInfo(address,uint256)": {
                "details": "Caller should be authorized to set royalty info.                  See {_canSetRoyaltyInfo}.                  Emits {DefaultRoyalty Event}; See {_setupDefaultRoyaltyInfo}.",
                "params": {
                  "_royaltyBps": "Updated royalty bps.",
                  "_royaltyRecipient": "Address to be set as default royalty recipient.",
                },
              },
              "setOwner(address)": {
                "params": {
                  "_newOwner": "The address to set as the new owner of the contract.",
                },
              },
              "setRoyaltyInfoForToken(uint256,address,uint256)": {
                "details": "Sets royalty info for \`_tokenId\`. Caller should be authorized to set royalty info.                  See {_canSetRoyaltyInfo}.                  Emits {RoyaltyForToken Event}; See {_setupRoyaltyInfoForToken}.",
                "params": {
                  "_bps": "Updated royalty bps for the token Id.",
                  "_recipient": "Address to be set as royalty recipient for given token Id.",
                },
              },
              "supportsInterface(bytes4)": {
                "details": "See ERC165: https://eips.ethereum.org/EIPS/eip-165",
              },
              "uri(uint256)": {
                "params": {
                  "_tokenId": "The tokenId of the NFT.",
                },
                "returns": {
                  "_0": "The metadata URI for the given tokenId.",
                },
              },
              "verifyClaim(address,uint256,uint256)": {
                "details": "Checks a request to claim NFTs against a custom condition.",
                "params": {
                  "_claimer": "Caller of the claim function.",
                  "_quantity": "The number of NFTs being claimed.",
                  "_tokenId": "The tokenId of the lazy minted NFT to mint.",
                },
              },
            },
            "title": "CatAttackNFT - The game contract for https://catattacknft.vercel.app/",
            "version": 1,
          },
          "userdoc": {
            "events": {
              "BatchMetadataUpdate(uint256,uint256)": {
                "notice": "So that the third-party platforms such as NFT market could timely update the images and related attributes of the NFTs.",
              },
            },
            "kind": "user",
            "methods": {
              "attack(address)": {
                "notice": "Lets a Ninja cat owner attack another user's to burn their cats",
              },
              "balanceOf(address,uint256)": {
                "notice": "Get the balance of an account's Tokens.",
              },
              "burn(address,uint256,uint256)": {
                "notice": "Burn a cat to either level up or attack another cat",
              },
              "burnBatch(address,uint256[],uint256[])": {
                "notice": "Lets an owner or approved operator burn NFTs of the given tokenIds.",
              },
              "claim(address,uint256,uint256)": {
                "notice": "Lets an address claim multiple lazy minted NFTs at once to a recipient.                   This function prevents any reentrant calls, and is not allowed to be overridden.                   Contract creators should override \`verifyClaim\` and \`transferTokensOnClaim\`                   functions to create custom logic for verification and claiming,                   for e.g. price collection, allowlist, max quantity, etc.",
              },
              "claimKitten()": {
                "notice": "Claim a kitten to start playing, but only if you don't already own a cat",
              },
              "contractURI()": {
                "notice": "Returns the contract metadata URI.",
              },
              "getBaseURICount()": {
                "notice": "Returns the count of batches of NFTs.",
              },
              "getBatchIdAtIndex(uint256)": {
                "notice": "Returns the ID for the batch of tokens at the given index.",
              },
              "getDefaultRoyaltyInfo()": {
                "notice": "Returns the defualt royalty recipient and BPS for this contract's NFTs.",
              },
              "getRoyaltyInfoForToken(uint256)": {
                "notice": "View royalty info for a given token.",
              },
              "isApprovedForAll(address,address)": {
                "notice": "Queries the approval status of an operator for a given owner.",
              },
              "lazyMint(uint256,string,bytes)": {
                "notice": "Lets an authorized address lazy mint a given amount of NFTs.",
              },
              "multicall(bytes[])": {
                "notice": "Receives and executes a batch of function calls on this contract.",
              },
              "nextTokenIdToMint()": {
                "notice": "The tokenId assigned to the next new NFT to be lazy minted.",
              },
              "owner()": {
                "notice": "Returns the owner of the contract.",
              },
              "royaltyInfo(uint256,uint256)": {
                "notice": "View royalty info for a given token and sale price.",
              },
              "safeTransferFrom(address,address,uint256,uint256,bytes)": {
                "notice": "Transfer cats to level up",
              },
              "setContractURI(string)": {
                "notice": "Lets a contract admin set the URI for contract-level metadata.",
              },
              "setDefaultRoyaltyInfo(address,uint256)": {
                "notice": "Updates default royalty recipient and bps.",
              },
              "setOwner(address)": {
                "notice": "Lets an authorized wallet set a new owner for the contract.",
              },
              "setRoyaltyInfoForToken(uint256,address,uint256)": {
                "notice": "Updates default royalty recipient and bps for a particular token.",
              },
              "startGame()": {
                "notice": "Lets the owner restart the game",
              },
              "stopGame()": {
                "notice": "Lets the owner pause the game",
              },
              "totalSupply(uint256)": {
                "notice": "Returns the total supply of NFTs of a given tokenId",
              },
              "uri(uint256)": {
                "notice": "Returns the metadata URI for the given tokenId.",
              },
              "verifyClaim(address,uint256,uint256)": {
                "notice": "Override this function to add logic for claim verification, based on conditions                   such as allowlist, price, max quantity etc.",
              },
            },
            "version": 1,
          },
        },
        "publisher": "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
        "routerType": "none",
        "settings": {
          "compilationTarget": {
            "src/CatAttackNFT.sol": "CatAttackNFT",
          },
          "evmVersion": "paris",
          "libraries": {},
          "metadata": {
            "bytecodeHash": "ipfs",
          },
          "optimizer": {
            "enabled": true,
            "runs": 200,
          },
          "remappings": [
            ":@chainlink/=lib/contracts/lib/chainlink/",
            ":@ds-test/=lib/contracts/lib/ds-test/src/",
            ":@openzeppelin/contracts-upgradeable/=lib/contracts/lib/openzeppelin-contracts-upgradeable/contracts/",
            ":@openzeppelin/contracts/=lib/contracts/lib/openzeppelin-contracts/contracts/",
            ":@rari-capital/solmate/=lib/contracts/lib/seaport/lib/solmate/",
            ":@seaport/=lib/contracts/lib/seaport/contracts/",
            ":@solady/=lib/contracts/lib/solady/",
            ":@std/=lib/contracts/lib/forge-std/src/",
            ":@thirdweb-dev/contracts/=lib/contracts/contracts/",
            ":@thirdweb-dev/dynamic-contracts/=lib/contracts/lib/dynamic-contracts/",
            ":ERC721A-Upgradeable/=lib/contracts/lib/ERC721A-Upgradeable/contracts/",
            ":ERC721A/=lib/contracts/lib/ERC721A/contracts/",
            ":chainlink/=lib/contracts/lib/chainlink/contracts/",
            ":contracts/=lib/contracts/contracts/",
            ":ds-test/=lib/contracts/lib/ds-test/src/",
            ":dynamic-contracts/=lib/contracts/lib/dynamic-contracts/src/",
            ":erc4626-tests/=lib/contracts/lib/openzeppelin-contracts-upgradeable/lib/erc4626-tests/",
            ":erc721a-upgradeable/=lib/contracts/lib/ERC721A-Upgradeable/",
            ":erc721a/=lib/contracts/lib/ERC721A/",
            ":forge-std/=lib/forge-std/src/",
            ":lib/sstore2/=lib/contracts/lib/dynamic-contracts/lib/sstore2/",
            ":murky/=lib/contracts/lib/murky/",
            ":openzeppelin-contracts-upgradeable/=lib/contracts/lib/openzeppelin-contracts-upgradeable/",
            ":openzeppelin-contracts/=lib/contracts/lib/openzeppelin-contracts/",
            ":openzeppelin/=lib/contracts/lib/openzeppelin-contracts-upgradeable/contracts/",
            ":seaport-core/=lib/contracts/lib/seaport-core/src/",
            ":seaport-sol/=lib/contracts/lib/seaport-sol/src/",
            ":seaport-types/=lib/contracts/lib/seaport-types/src/",
            ":seaport/=lib/contracts/lib/seaport/",
            ":solady/=lib/contracts/lib/solady/src/",
            ":solarray/=lib/contracts/lib/seaport/lib/solarray/src/",
            ":solmate/=lib/contracts/lib/seaport/lib/solmate/src/",
            ":sstore2/=lib/contracts/lib/dynamic-contracts/lib/sstore2/contracts/",
          ],
        },
        "sources": {
          "lib/contracts/contracts/base/ERC1155LazyMint.sol": {
            "keccak256": "0xdf81210defe226ea6a3bd3e986ca75ffd8d58010ba7bc3ed9f66657312ff69af",
            "license": "Apache-2.0",
            "urls": [
              "bzz-raw://0b0edac74c1b7b949bf2ef4093b465d1b7e7261bd4ae9ac0e6a055386bed7eae",
              "dweb:/ipfs/Qmf4S5enGdMGEgBGZ8FXpDmj82R7xixAD4LwGntJMSyBsJ",
            ],
          },
          "lib/contracts/contracts/eip/ERC1155.sol": {
            "keccak256": "0xbac4d98722f937b876908b0baf24ff2854e65da244412db4622064d87c63a752",
            "license": "Apache 2.0",
            "urls": [
              "bzz-raw://66af1bbb9833ad15656d41faafaf835fb98dec1a87554b143a3bb0e0eabe2fb3",
              "dweb:/ipfs/QmQUSxBYCT5VDvx4V5b4DX8gZyGgqSC42TKwYcd6CBZ2jf",
            ],
          },
          "lib/contracts/contracts/eip/interface/IERC1155.sol": {
            "keccak256": "0x19b9bee642c1b8e21c412a90fd08784dad7f567651edbe72bebf70d16551a2f4",
            "license": "Apache-2.0",
            "urls": [
              "bzz-raw://9c3f49fddb363032b69842d35cfc2aa72c8a36f3db2bed1e9bad3fc486b96df5",
              "dweb:/ipfs/QmQ5tn1fboZBmXWDXRfBMGJqYS9FtaQC8NYHaCiJapaJLF",
            ],
          },
          "lib/contracts/contracts/eip/interface/IERC1155Metadata.sol": {
            "keccak256": "0xe9d530111d75c5d6db4ca4f30dd76d6a29d9363ab7390e922942a0fc9e3ce32e",
            "license": "Apache-2.0",
            "urls": [
              "bzz-raw://8272be1ca643bd3038fd67b00acad09a8dca44536284bcca6b862d09f8b53e43",
              "dweb:/ipfs/Qme9wiWPDfh36xm7TNaxpAYxv5jAptMNLtYksRwc5zNFbU",
            ],
          },
          "lib/contracts/contracts/eip/interface/IERC1155Receiver.sol": {
            "keccak256": "0xfef511c703e7ebdb193d35a67e0d9b70728789b2ac45cc5cf5ee56c4ad034f00",
            "license": "MIT",
            "urls": [
              "bzz-raw://f838e560ba0caddc54ad4ba082e0ff3bf27a721c15bc0cf19791fef7940837a5",
              "dweb:/ipfs/QmTwfwYYK4Ky9PPhdDoVVmZJaJ7y2hZDH8YnBQRfiA8Baz",
            ],
          },
          "lib/contracts/contracts/eip/interface/IERC165.sol": {
            "keccak256": "0x35d0a916f70344a5fcc6c67cb531b6150d2fce43e72a6282385eab02020f2f49",
            "license": "MIT",
            "urls": [
              "bzz-raw://75ccd8b9a8b52a93b8097fcb8181b7afb6d72bbe6eaabf434f0481a7a207cc8a",
              "dweb:/ipfs/QmPUZAEE4nwkijcE2amAXAWEVGVG5XaKWGhpgnRwpAf93R",
            ],
          },
          "lib/contracts/contracts/eip/interface/IERC2981.sol": {
            "keccak256": "0x6a1ea21755c29a9f74e21176486902eb943f2f3aaa465b351b0c1b7c5794f5aa",
            "license": "Apache 2.0",
            "urls": [
              "bzz-raw://08d1accd523ed037c07d097fa2121597b00f02f0a0a5a5669a24a0924e4c01f6",
              "dweb:/ipfs/Qmem3H95uDQuACtgLC14PRWezwmvrwdjBKB4iY7Kz9LGiT",
            ],
          },
          "lib/contracts/contracts/extension/BatchMintMetadata.sol": {
            "keccak256": "0x97bf86276ecd830c41636c93b1aff2bd2271b5ca1e5b6ccd2813fbce240f96d1",
            "license": "Apache-2.0",
            "urls": [
              "bzz-raw://e6db0f351255c37e0a9cce1357b7adb93c321e16651d2ba1cefbc47e126e90a1",
              "dweb:/ipfs/QmfNpmBBU5K8N4aGV8kTHvdD1oaP8XiWekizvEDyfeGDMw",
            ],
          },
          "lib/contracts/contracts/extension/ContractMetadata.sol": {
            "keccak256": "0x0752a8a6eeb7e61acfe50e39344c16258a89cfaa55fc9db9289dc6e18ae7af66",
            "license": "Apache-2.0",
            "urls": [
              "bzz-raw://6ca1ffdbc96af19fa17e23fd8a1aebe2d5849e63ded33805228b26f1901125e8",
              "dweb:/ipfs/QmckQ7iwwm9LuywfpuYP7Y7AcUW8yNy1eDL741ug8w1wyv",
            ],
          },
          "lib/contracts/contracts/extension/LazyMint.sol": {
            "keccak256": "0x54403018bf34bae1a06be6692ea49c2694e969925a4ab55442089f99a902b6df",
            "license": "Apache-2.0",
            "urls": [
              "bzz-raw://395276b4c28c68abecc49c20b63d118ec40ad82769008124c07c8c0bb24cd1e4",
              "dweb:/ipfs/QmUNdwffH6msk4Cb9zcUdHbKUByiRNTZ9XfUD3DzPax7Nh",
            ],
          },
          "lib/contracts/contracts/extension/Multicall.sol": {
            "keccak256": "0xe4479833f6297a1461478733e14dd0e9b8376da474fa7067cb8937f9ccff2836",
            "license": "Apache 2.0",
            "urls": [
              "bzz-raw://b03c41daeba7783e04387eff65f6ccc50f2312d895ff3cb9198410976df19c4e",
              "dweb:/ipfs/QmV54V9YQn9TWZhoAsFex8GdCkQmFX6iajYnUv5zU1sxEQ",
            ],
          },
          "lib/contracts/contracts/extension/Ownable.sol": {
            "keccak256": "0xd5edceecc8eee7460707d4c078f8273e8e488ab76cd2dcfaab36bd48e7f8bfaa",
            "license": "Apache-2.0",
            "urls": [
              "bzz-raw://0e0a2692225385848e6b781dd54381e27d7287be46033a00b67d3c66d19bb1a3",
              "dweb:/ipfs/QmStFLkQwcpTtzNefx4yxNxmHbf4WdVSzkSNEN97vaWzyg",
            ],
          },
          "lib/contracts/contracts/extension/Royalty.sol": {
            "keccak256": "0x9516b9df33e19538638ce1f756bba1f992367ff02255c1d800ec4e6b3f2c7c74",
            "license": "Apache-2.0",
            "urls": [
              "bzz-raw://cc726a319d2c55401dc0cba508d3d1057c3a793a56ea757ab51a44bcaa3e63ae",
              "dweb:/ipfs/QmaREGBvNt1wEUrJiLPkspyZieyg899K4ceCrrcRPuHRZg",
            ],
          },
          "lib/contracts/contracts/extension/interface/IClaimableERC1155.sol": {
            "keccak256": "0x3fdfdad356fdd98e5dd1ec1f65d921c696b44bd9505f92a8440ad2430cfbb48c",
            "license": "Apache-2.0",
            "urls": [
              "bzz-raw://bbc4177861066675e9e13caeead661f9003553c22edf1e4d5ed43062f497b52b",
              "dweb:/ipfs/QmPWERVCFoaCKkBnSNetX1YDhF7VtDVK6yEVYruubZRE1Q",
            ],
          },
          "lib/contracts/contracts/extension/interface/IContractMetadata.sol": {
            "keccak256": "0x41d3f7f43c124e9ff0247cb94f4e8fc8c5a79b1de331c67eb03654154248d7f2",
            "license": "Apache-2.0",
            "urls": [
              "bzz-raw://fa8d6251cf3a876193cc719b456c02ff23d3f2d5486431e9bdaf290be9a4ce9a",
              "dweb:/ipfs/QmRwnA2q15Vdkc66fz6BAinZM3tjuVNHn5CeGzc7ZFMAzr",
            ],
          },
          "lib/contracts/contracts/extension/interface/ILazyMint.sol": {
            "keccak256": "0x480953502a40e438d855392e322adc0369e2109f6d46fb9ec2bb3ad0afbb0aec",
            "license": "Apache-2.0",
            "urls": [
              "bzz-raw://2b3bb332d4f5e38f9786b00564ad417e48c689b4a92a60888c3845b986c995a3",
              "dweb:/ipfs/QmPVM4KTUeLD7uVCfP8MBQNRo7pU8xF3rXQuDcx3C6cLxA",
            ],
          },
          "lib/contracts/contracts/extension/interface/IMulticall.sol": {
            "keccak256": "0xe2bbd37b8fdb9cc8b933e598512a068ebb214b3f5abc2bc634916def55be4ef3",
            "license": "MIT",
            "urls": [
              "bzz-raw://012352099c262348ac755a53b082af520babc6c66dc5f1251fc23609728340ca",
              "dweb:/ipfs/QmcXEgzQ53jdJX5ZNy8zivvUjDq7J8WTnR1yAiwTpkQ2ar",
            ],
          },
          "lib/contracts/contracts/extension/interface/IOwnable.sol": {
            "keccak256": "0xd659a64da6264fdd50ee379be032fea4917eba4fadfd6d366107fb17e46907f3",
            "license": "Apache-2.0",
            "urls": [
              "bzz-raw://c15940c4a3d229f4fdd1226fe297a58fde10b07b86a34de1ed11a8802dd5dea9",
              "dweb:/ipfs/QmS8p8CxWiahLkYsCWNhFjCnmQzuc4ck3kjYYuCFj8LsmC",
            ],
          },
          "lib/contracts/contracts/extension/interface/IRoyalty.sol": {
            "keccak256": "0x06f66ba14674e2396219fb361486d43e6059933114a54c26b6e01dc3bf794f0d",
            "license": "Apache-2.0",
            "urls": [
              "bzz-raw://ad01c637bda34a7c8e75d9e0b7412f5817bfc547754eb49e990406294de9531e",
              "dweb:/ipfs/QmRBqte5ir3T9Rew3YXn5v6otp7LMq48H4MxRhuQ4nyqqd",
            ],
          },
          "lib/contracts/contracts/external-deps/openzeppelin/security/ReentrancyGuard.sol": {
            "keccak256": "0x2030bba0e41fb3daead24cdba39cd9d8ce2748de68e57f1c811420419a739afb",
            "license": "MIT",
            "urls": [
              "bzz-raw://1a64e19e10d66555abcf0b5392bb27f9e65f674d7688761f02f2c8b508490623",
              "dweb:/ipfs/QmNhMchAD6kuHFAAgdwCwuNUS3uaUD2gwofT5kxQAQeWH6",
            ],
          },
          "lib/contracts/contracts/lib/Address.sol": {
            "keccak256": "0xa1e2c06c07422ce6f27ab1c4d4ce62bdc3200e082b735b5e3a75c2e7b61cbc4f",
            "license": "Apache-2.0",
            "urls": [
              "bzz-raw://cc90229c980f78c582a05386d4621172c7d20dec9ad528a5bf1d59b243fff0a5",
              "dweb:/ipfs/QmcZZLaZ9XU1gWj7b9EBZftPoED3pKEvvFGhS5yBvtMPtn",
            ],
          },
          "lib/contracts/contracts/lib/Strings.sol": {
            "keccak256": "0xd8fcca4db8f1678a124ae0d3b4da6c29e9737e5ae03f90f18b84261ae4499568",
            "license": "Apache-2.0",
            "urls": [
              "bzz-raw://ed0d23694c31613645904cc5d6f3e08ecd34063aeb5bd23ebc9a8223a67f91fb",
              "dweb:/ipfs/QmTf9WBdvzU2dDDTqeSn1g85AkXTe8MfN1pdyaVzm15Cdb",
            ],
          },
          "src/CatAttackNFT.sol": {
            "keccak256": "0xa4daadfa5c2bee9cc6a1e906e5b1f3fc82d722488794cf9d3b4b9db3667dc6c8",
            "license": "Apache-2.0",
            "urls": [
              "bzz-raw://d548332c72234abc0467a821bb6d371f070201306866d1f3f089f230dcc91b5c",
              "dweb:/ipfs/QmWvVuxyPgSGad9SSXJ2UwTjkAwpFPpXtTL1N1Jzd1St1X",
            ],
          },
        },
        "version": "0.0.1",
      }
    `);

    await expect(
      sendAndConfirmTransaction({
        transaction: publishContract({
          contract: publisherContract,
          account: TEST_ACCOUNT_A,
          previousMetadata: publishedData,
          metadata: {
            ...publishedData,
            version: "0.0.1",
            changelog: "Initial release 2",
          },
        }),
        account: TEST_ACCOUNT_A,
      }),
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      "[Error: Version 0.0.1 is not greater than 0.0.1]",
    );

    const tx2 = publishContract({
      contract: publisherContract,
      account: TEST_ACCOUNT_A,
      previousMetadata: publishedData,
      metadata: {
        ...publishedData,
        version: "0.0.2",
        changelog: "Initial release 2",
      },
    });
    const result2 = await sendAndConfirmTransaction({
      transaction: tx2,
      account: TEST_ACCOUNT_A,
    });

    expect(result2.transactionHash.length).toBeGreaterThan(0);
    const logs2 = parseEventLogs({
      events: [contractPublishedEvent()],
      logs: result2.logs,
    });
    expect(logs2?.[0]?.args.publishedContract.contractId).toBe("CatAttackNFT");
    expect(logs2?.[0]?.args.publishedContract.publishMetadataUri).toBeDefined();
    const publishedData2 = await fetchDeployMetadata({
      client: TEST_CLIENT,
      uri: logs2?.[0]?.args.publishedContract.publishMetadataUri ?? "",
    });
    expect(publishedData2.version).toBe("0.0.2");
  }, 120000);
});
