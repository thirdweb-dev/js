import type { Chain } from "../src/types";
export default {
  "chainId": 1970,
  "chain": "SCS",
  "name": "Super Smart Chain Mainnet",
  "rpc": [
    "https://super-smart-chain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.scschain.com"
  ],
  "slug": "super-smart-chain",
  "icon": {
    "url": "ipfs://QmW4C4QHLMhLeH5MsdVbauMc2Skb4ehzLKU3egLKKoux4D",
    "width": 130,
    "height": 130,
    "format": "png"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "Super Chain Native Token",
    "symbol": "SCS",
    "decimals": 18
  },
  "infoURL": "https://scschain.com",
  "shortName": "scs",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://scan.scschain.com",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;