import type { Chain } from "../src/types";
export default {
  "name": "Pego Network",
  "chain": "PEGO",
  "rpc": [
    "https://pego-network.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://pegorpc.com",
    "https://node1.pegorpc.com",
    "https://node2.pegorpc.com",
    "https://node3.pegorpc.com"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Pego Native Token",
    "symbol": "PG",
    "decimals": 18
  },
  "infoURL": "https://pego.network",
  "shortName": "pg",
  "chainId": 20201022,
  "networkId": 20201022,
  "icon": {
    "url": "ipfs://QmVf1afskRHuZjFSLCZH8397KrVNAoYgyAePX9VMBrPVtx",
    "width": 246,
    "height": 247,
    "format": "png"
  },
  "explorers": [
    {
      "name": "Pego Network Explorer",
      "url": "https://scan.pego.network",
      "standard": "EIP3091"
    }
  ],
  "testnet": false,
  "slug": "pego-network"
} as const satisfies Chain;