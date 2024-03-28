import type { Chain } from "../src/types";
export default {
  "chain": "Larissa",
  "chainId": 9898,
  "explorers": [
    {
      "name": "Larissa Scan",
      "url": "https://scan.larissa.network",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://QmZTWoZ3LvivSinaJ4aSwqU8pCXw8oSZNnUCh4wwXxtAoQ",
    "width": 500,
    "height": 500,
    "format": "png"
  },
  "infoURL": "https://larissa.network",
  "name": "Larissa Chain",
  "nativeCurrency": {
    "name": "Larissa",
    "symbol": "LRS",
    "decimals": 18
  },
  "networkId": 1,
  "rpc": [
    "https://9898.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.larissa.network"
  ],
  "shortName": "lrs",
  "slip44": 9898,
  "slug": "larissa-chain",
  "status": "active",
  "testnet": false,
  "title": "Larissa Chain"
} as const satisfies Chain;