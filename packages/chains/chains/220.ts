import type { Chain } from "../src/types";
export default {
  "chain": "Flag",
  "chainId": 220,
  "explorers": [
    {
      "name": "flagscan",
      "url": "https://scan.flagscan.io",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "features": [],
  "icon": {
    "url": "ipfs://QmXo2p1i4zsbTNEu41EjjrhdmbKFDGHEHeADXZ3x2fgNKE/1682003789585.jpeg",
    "width": 200,
    "height": 200,
    "format": "jpeg"
  },
  "infoURL": "https://flagblockchain.com/",
  "name": "Flag Mainnet",
  "nativeCurrency": {
    "name": "Flag",
    "symbol": "Flag",
    "decimals": 18
  },
  "networkId": 220,
  "redFlags": [],
  "rpc": [
    "https://flag.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://220.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet.flagscan.io/"
  ],
  "shortName": "Flag",
  "slug": "flag",
  "testnet": false
} as const satisfies Chain;