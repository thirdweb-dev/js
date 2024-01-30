import type { Chain } from "../src/types";
export default {
  "chain": "1220",
  "chainId": 1220,
  "explorers": [
    {
      "name": "flagscan",
      "url": "https://testnet-scan.flagscan.io/",
      "standard": "EIP3091"
    }
  ],
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
  "rpc": [],
  "shortName": "Flag",
  "slug": "flag-testnet",
  "testnet": true
} as const satisfies Chain;