export default {
  "name": "Optimism Bedrock (Goerli Alpha Testnet)",
  "chain": "ETH",
  "rpc": [
    "https://optimism-bedrock-goerli-alpha-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://alpha-1-replica-0.bedrock-goerli.optimism.io",
    "https://alpha-1-replica-1.bedrock-goerli.optimism.io",
    "https://alpha-1-replica-2.bedrock-goerli.optimism.io"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Goerli Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "infoURL": "https://community.optimism.io/docs/developers/bedrock",
  "shortName": "obgor",
  "chainId": 28528,
  "networkId": 28528,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://blockscout.com/optimism/bedrock-alpha",
      "standard": "EIP3091"
    }
  ],
  "testnet": true,
  "slug": "optimism-bedrock-goerli-alpha-testnet"
} as const;