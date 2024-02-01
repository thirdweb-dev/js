import type { Chain } from "../src/types";
export default {
  "chain": "1220",
  "chainId": 1220,
  "explorers": [],
  "faucets": [],
  "features": [],
  "icon": {
    "url": "ipfs://QmXo2p1i4zsbTNEu41EjjrhdmbKFDGHEHeADXZ3x2fgNKE/1682003789585.jpeg",
    "width": 3600,
    "height": 3600,
    "format": "jpeg"
  },
  "infoURL": "https://flagblockchain.com/",
  "name": "Flag Testnet",
  "nativeCurrency": {
    "name": "FLAG",
    "symbol": "FLAG",
    "decimals": 18
  },
  "networkId": 1220,
  "redFlags": [],
  "rpc": [
    "https://flag-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://1220.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet.flagscan.io"
  ],
  "shortName": "Flag",
  "slug": "flag-testnet",
  "testnet": true
} as const satisfies Chain;