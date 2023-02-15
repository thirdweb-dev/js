export default {
  "name": "Evmos Testnet",
  "chain": "Evmos",
  "rpc": [
    "https://evmos-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://eth.bd.evmos.dev:8545"
  ],
  "faucets": [
    "https://faucet.evmos.dev"
  ],
  "nativeCurrency": {
    "name": "test-Evmos",
    "symbol": "tEVMOS",
    "decimals": 18
  },
  "infoURL": "https://evmos.org",
  "shortName": "evmos-testnet",
  "chainId": 9000,
  "networkId": 9000,
  "icon": {
    "url": "ipfs://QmeZW6VKUFTbz7PPW8PmDR3ZHa6osYPLBFPnW8T5LSU49c",
    "width": 400,
    "height": 400,
    "format": "png"
  },
  "explorers": [
    {
      "name": "Evmos EVM Explorer",
      "url": "https://evm.evmos.dev",
      "standard": "EIP3091",
      "icon": "evmos"
    },
    {
      "name": "Evmos Cosmos Explorer",
      "url": "https://explorer.evmos.dev",
      "standard": "none",
      "icon": "evmos"
    }
  ],
  "testnet": true,
  "slug": "evmos-testnet"
} as const;