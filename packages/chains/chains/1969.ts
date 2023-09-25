import type { Chain } from "../src/types";
export default {
  "chainId": 1969,
  "chain": "TSCS",
  "name": "Super Smart Chain Testnet",
  "rpc": [
    "https://super-smart-chain-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnetrpc.scschain.com"
  ],
  "slug": "super-smart-chain-testnet",
  "icon": {
    "url": "ipfs://QmW4C4QHLMhLeH5MsdVbauMc2Skb4ehzLKU3egLKKoux4D",
    "width": 130,
    "height": 130,
    "format": "png"
  },
  "faucets": [
    "https://testnet.scschain.com"
  ],
  "nativeCurrency": {
    "name": "Super Chain Native Token",
    "symbol": "SCS",
    "decimals": 18
  },
  "infoURL": "https://testnet.scschain.com",
  "shortName": "tscs",
  "testnet": true,
  "redFlags": [],
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://testnetscan.scschain.com",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;