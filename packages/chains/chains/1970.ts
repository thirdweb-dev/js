import type { Chain } from "../src/types";
export default {
  "chain": "SCS",
  "chainId": 1970,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://scan.scschain.com",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "features": [],
  "icon": {
    "url": "ipfs://QmW4C4QHLMhLeH5MsdVbauMc2Skb4ehzLKU3egLKKoux4D",
    "width": 130,
    "height": 130,
    "format": "png"
  },
  "infoURL": "https://scschain.com",
  "name": "Super Smart Chain Mainnet",
  "nativeCurrency": {
    "name": "Super Chain Native Token",
    "symbol": "TSCS",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://super-smart-chain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.scschain.com"
  ],
  "shortName": "scs",
  "slug": "super-smart-chain",
  "testnet": false
} as const satisfies Chain;