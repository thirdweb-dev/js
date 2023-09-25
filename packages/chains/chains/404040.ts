import type { Chain } from "../src/types";
export default {
  "chainId": 404040,
  "chain": "TPBX",
  "name": "Tipboxcoin Mainnet",
  "rpc": [
    "https://tipboxcoin.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet-rpc.tipboxcoin.net"
  ],
  "slug": "tipboxcoin",
  "icon": {
    "url": "ipfs://QmbiaHnR3fVVofZ7Xq2GYZxwHkLEy3Fh5qDtqnqXD6ACAh",
    "width": 192,
    "height": 192,
    "format": "png"
  },
  "faucets": [
    "https://faucet.tipboxcoin.net"
  ],
  "nativeCurrency": {
    "name": "Tipboxcoin",
    "symbol": "TPBX",
    "decimals": 18
  },
  "infoURL": "https://tipboxcoin.net",
  "shortName": "TPBXm",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "Tipboxcoin",
      "url": "https://tipboxcoin.net",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;