import type { Chain } from "../src/types";
export default {
  "name": "Super Smart Chain Testnet",
  "chain": "TSCS",
  "rpc": [
    "https://super-smart-chain-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnetrpc.scschain.com"
  ],
  "faucets": [
    "https://testnet.scschain.com"
  ],
  "nativeCurrency": {
    "name": "Super Chain Native Token",
    "symbol": "TSCS",
    "decimals": 18
  },
  "infoURL": "https://testnet.scschain.com",
  "shortName": "tscs",
  "chainId": 1969,
  "networkId": 1969,
  "icon": {
    "url": "ipfs://QmW4C4QHLMhLeH5MsdVbauMc2Skb4ehzLKU3egLKKoux4D",
    "width": 130,
    "height": 130,
    "format": "png"
  },
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://testnetscan.scschain.com",
      "standard": "EIP3091"
    }
  ],
  "testnet": true,
  "slug": "super-smart-chain-testnet"
} as const satisfies Chain;