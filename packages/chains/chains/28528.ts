import type { Chain } from "../src/types";
export default {
  "chainId": 28528,
  "chain": "ETH",
  "name": "Optimism Bedrock (Goerli Alpha Testnet)",
  "rpc": [
    "https://optimism-bedrock-goerli-alpha-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://alpha-1-replica-0.bedrock-goerli.optimism.io",
    "https://alpha-1-replica-1.bedrock-goerli.optimism.io",
    "https://alpha-1-replica-2.bedrock-goerli.optimism.io"
  ],
  "slug": "optimism-bedrock-goerli-alpha-testnet",
  "faucets": [],
  "nativeCurrency": {
    "name": "Goerli Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "infoURL": "https://community.optimism.io/docs/developers/bedrock",
  "shortName": "obgor",
  "testnet": true,
  "redFlags": [],
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://blockscout.com/optimism/bedrock-alpha",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;