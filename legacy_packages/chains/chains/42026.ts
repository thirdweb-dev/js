import type { Chain } from "../src/types";
export default {
  "chain": "DTZ",
  "chainId": 42026,
  "explorers": [
    {
      "name": "Blockscout",
      "url": "https://explorer.donatuz.com",
      "standard": "EIP3091",
      "icon": {
        "url": "ipfs://QmRfwNkpQ29BNtE9MMi8z4G6bUmnNNUqAjuz1eDpcbM1ZS",
        "width": 512,
        "height": 512,
        "format": "png"
      }
    }
  ],
  "faucets": [],
  "features": [],
  "icon": {
    "url": "ipfs://QmRfwNkpQ29BNtE9MMi8z4G6bUmnNNUqAjuz1eDpcbM1ZS",
    "width": 512,
    "height": 512,
    "format": "png"
  },
  "name": "Donatuz",
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "networkId": 42026,
  "redFlags": [],
  "rpc": [
    "https://42026.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.donatuz.com"
  ],
  "shortName": "DTZ",
  "slug": "donatuz",
  "testnet": false
} as const satisfies Chain;