import type { Chain } from "../types";
export default {
  "chain": "ETH",
  "chainId": 28528,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://blockscout.com/optimism/bedrock-alpha",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "infoURL": "https://community.optimism.io/docs/developers/bedrock",
  "name": "Optimism Bedrock (Goerli Alpha Testnet)",
  "nativeCurrency": {
    "name": "Goerli Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "networkId": 28528,
  "rpc": [
    "https://optimism-bedrock-goerli-alpha-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://28528.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://alpha-1-replica-0.bedrock-goerli.optimism.io",
    "https://alpha-1-replica-1.bedrock-goerli.optimism.io",
    "https://alpha-1-replica-2.bedrock-goerli.optimism.io",
    "https://alpha-1-replica-2.bedrock-goerli.optimism.io"
  ],
  "shortName": "obgor",
  "slug": "optimism-bedrock-goerli-alpha-testnet",
  "testnet": true
} as const satisfies Chain;