import type { Chain } from "../src/types";
export default {
  "chain": "TPBX",
  "chainId": 4141,
  "explorers": [
    {
      "name": "Tipboxcoin",
      "url": "https://testnet.tipboxcoin.net",
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
  "name": "Tipboxcoin Testnet",
  "nativeCurrency": {
    "name": "Tipboxcoin",
    "symbol": "TPBX",
    "decimals": 18
  },
  "networkId": 4141,
  "rpc": [
    "https://tipboxcoin-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://4141.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet-rpc.tipboxcoin.net"
  ],
  "shortName": "TPBXt",
  "slip44": 1,
  "slug": "tipboxcoin-testnet",
  "testnet": true
} as const satisfies Chain;