import type { Chain } from "../src/types";
export default {
  "name": "Super Smart Chain Mainnet",
  "chain": "SCS",
  "rpc": [
    "https://super-smart-chain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://superexchain.com:8545"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Super Chain Native Token",
    "symbol": "SCS",
    "decimals": 18
  },
  "infoURL": "https://superexchain.com",
  "shortName": "scs",
  "chainId": 1970,
  "networkId": 1970,
  "icon": {
    "url": "ipfs://QmW4C4QHLMhLeH5MsdVbauMc2Skb4ehzLKU3egLKKoux4D",
    "width": 130,
    "height": 130,
    "format": "png"
  },
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://scan.superexchain.com",
      "standard": "EIP3091"
    }
  ],
  "testnet": false,
  "slug": "super-smart-chain"
} as const satisfies Chain;