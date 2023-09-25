import type { Chain } from "../src/types";
export default {
  "chainId": 20201022,
  "chain": "PEGO",
  "name": "Pego Network",
  "rpc": [
    "https://pego-network.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://pegorpc.com",
    "https://node1.pegorpc.com",
    "https://node2.pegorpc.com",
    "https://node3.pegorpc.com"
  ],
  "slug": "pego-network",
  "icon": {
    "url": "ipfs://QmVf1afskRHuZjFSLCZH8397KrVNAoYgyAePX9VMBrPVtx",
    "width": 246,
    "height": 247,
    "format": "png"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "Pego Native Token",
    "symbol": "PG",
    "decimals": 18
  },
  "infoURL": "https://pego.network",
  "shortName": "pg",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "Pego Network Explorer",
      "url": "https://scan.pego.network",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;