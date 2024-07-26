import type { Chain } from "../src/types";
export default {
  "chain": "NeoX",
  "chainId": 12227331,
  "explorers": [
    {
      "name": "neox-scan",
      "url": "https://testnet.scan.banelabs.org",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://QmR3iCrjrW814fyv79UeVimDT4fTeBQcpYgMYxv1U6W15u",
    "width": 512,
    "height": 512,
    "format": "png"
  },
  "infoURL": "https://neo.org/",
  "name": "NeoX Testnet",
  "nativeCurrency": {
    "name": "Gas",
    "symbol": "GAS",
    "decimals": 18
  },
  "networkId": 12227331,
  "rpc": [
    "https://12227331.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet.rpc.banelabs.org/"
  ],
  "shortName": "neox",
  "slug": "neox-testnet",
  "status": "active",
  "testnet": true
} as const satisfies Chain;