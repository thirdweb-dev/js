import type { Chain } from "../src/types";
export default {
  "chain": "TPBX",
  "chainId": 404040,
  "explorers": [
    {
      "name": "Tipboxcoin",
      "url": "https://tipboxcoin.net",
      "standard": "EIP3091"
    }
  ],
  "faucets": [
    "https://faucet.tipboxcoin.net"
  ],
  "icon": {
    "url": "ipfs://QmbiaHnR3fVVofZ7Xq2GYZxwHkLEy3Fh5qDtqnqXD6ACAh",
    "width": 192,
    "height": 192,
    "format": "png"
  },
  "infoURL": "https://tipboxcoin.net",
  "name": "Tipboxcoin Mainnet",
  "nativeCurrency": {
    "name": "Tipboxcoin",
    "symbol": "TPBX",
    "decimals": 18
  },
  "networkId": 404040,
  "rpc": [
    "https://404040.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet-rpc.tipboxcoin.net"
  ],
  "shortName": "TPBXm",
  "slug": "tipboxcoin",
  "testnet": false
} as const satisfies Chain;