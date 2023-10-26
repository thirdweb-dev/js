import type { Chain } from "../src/types";
export default {
  "chain": "TSCS",
  "chainId": 1969,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://testnetscan.scschain.com",
      "standard": "EIP3091"
    }
  ],
  "faucets": [
    "https://testnet.scschain.com"
  ],
  "icon": {
    "url": "ipfs://QmW4C4QHLMhLeH5MsdVbauMc2Skb4ehzLKU3egLKKoux4D",
    "width": 130,
    "height": 130,
    "format": "png"
  },
  "infoURL": "https://testnet.scschain.com",
  "name": "Super Smart Chain Testnet",
  "nativeCurrency": {
    "name": "Super Chain Native Token",
    "symbol": "TSCS",
    "decimals": 18
  },
  "networkId": 1969,
  "rpc": [
    "https://super-smart-chain-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://1969.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnetrpc.scschain.com"
  ],
  "shortName": "tscs",
  "slug": "super-smart-chain-testnet",
  "testnet": true
} as const satisfies Chain;