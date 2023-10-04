import type { Chain } from "../src/types";
export default {
  "chain": "BTC20",
  "chainId": 963,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://scan.bitcoincode.technology",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "features": [
    {
      "name": "EIP155"
    },
    {
      "name": "EIP1559"
    }
  ],
  "icon": {
    "url": "ipfs://QmRUzDpn3xqPYnjLuZvFs2Attio9VxGRUprXEjcNQDcpe5",
    "width": 375,
    "height": 456,
    "format": "png"
  },
  "infoURL": "https://bitcoincode.technology",
  "name": "BTC20 Smart Chain",
  "nativeCurrency": {
    "name": "BTCC",
    "symbol": "BTCC",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://btc20-smart-chain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.bitcoincode.technology/"
  ],
  "shortName": "btc20",
  "slug": "btc20-smart-chain",
  "testnet": false
} as const satisfies Chain;