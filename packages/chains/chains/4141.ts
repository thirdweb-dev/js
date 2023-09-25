import type { Chain } from "../src/types";
export default {
  "chainId": 4141,
  "chain": "TPBX",
  "name": "Tipboxcoin Testnet",
  "rpc": [
    "https://tipboxcoin-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet-rpc.tipboxcoin.net"
  ],
  "slug": "tipboxcoin-testnet",
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
  "shortName": "TPBXt",
  "testnet": true,
  "redFlags": [],
  "explorers": [
    {
      "name": "Tipboxcoin",
      "url": "https://testnet.tipboxcoin.net",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;