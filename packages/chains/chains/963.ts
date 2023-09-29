import type { Chain } from "../src/types";
export default {
  "name": "BTC20 Smart Chain",
  "chain": "BTC20",
  "rpc": [
    "https://btc20-smart-chain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.bitcoincode.technology/"
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
  "nativeCurrency": {
    "name": "BTCC",
    "symbol": "BTCC",
    "decimals": 18
  },
  "infoURL": "https://bitcoincode.technology",
  "shortName": "btc20",
  "chainId": 963,
  "networkId": 963,
  "icon": {
    "url": "ipfs://QmRUzDpn3xqPYnjLuZvFs2Attio9VxGRUprXEjcNQDcpe5",
    "width": 375,
    "height": 456,
    "format": "png"
  },
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://scan.bitcoincode.technology",
      "standard": "EIP3091"
    }
  ],
  "testnet": false,
  "slug": "btc20-smart-chain"
} as const satisfies Chain;