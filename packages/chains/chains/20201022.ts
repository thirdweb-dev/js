import type { Chain } from "../src/types";
export default {
  "chain": "PEGO",
  "chainId": 20201022,
  "explorers": [
    {
      "name": "Pego Network Explorer",
      "url": "https://scan.pego.network",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "features": [],
  "icon": {
    "url": "ipfs://QmVf1afskRHuZjFSLCZH8397KrVNAoYgyAePX9VMBrPVtx",
    "width": 246,
    "height": 247,
    "format": "png"
  },
  "infoURL": "https://pego.network",
  "name": "Pego Network",
  "nativeCurrency": {
    "name": "Pego Native Token",
    "symbol": "PG",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://pego-network.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://pegorpc.com",
    "https://node1.pegorpc.com",
    "https://node2.pegorpc.com",
    "https://node3.pegorpc.com"
  ],
  "shortName": "pg",
  "slug": "pego-network",
  "testnet": false
} as const satisfies Chain;