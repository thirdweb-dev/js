import type { Chain } from "../src/types";
export default {
  "chain": "ETH",
  "chainId": 28872323069,
  "explorers": [],
  "faucets": [],
  "icon": {
    "url": "ipfs://bafkreihdfuzytq2og65n3d3b2kzfvk6yywvqdlorrt6h76q4baz5phcvju",
    "width": 256,
    "height": 256,
    "format": "png"
  },
  "infoURL": "https://gitswarm.com/",
  "name": "GitSwarm Test Network",
  "nativeCurrency": {
    "name": "GitSwarm Ether",
    "symbol": "GS-ETH",
    "decimals": 18
  },
  "networkId": 28872323069,
  "rpc": [
    "https://28872323069.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://gitswarm.com:2096"
  ],
  "shortName": "GS-ETH",
  "slip44": 1,
  "slug": "gitswarm-test-network",
  "status": "incubating",
  "testnet": true,
  "title": "GitSwarm Test Network"
} as const satisfies Chain;