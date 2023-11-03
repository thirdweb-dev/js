import type { Chain } from "../types";
export default {
  "chain": "TLC",
  "chainId": 5177,
  "explorers": [
    {
      "name": "TLChain Explorer",
      "url": "https://explorer.tlchain.network",
      "standard": "none"
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://QmaR5TsgnWSjLys6wGaciKUbc5qYL3Es4jtgQcosVqDWR3",
    "width": 2048,
    "height": 2048,
    "format": "png"
  },
  "infoURL": "https://tlchain.network/",
  "name": "TLChain Network Mainnet",
  "nativeCurrency": {
    "name": "TLChain Network",
    "symbol": "TLC",
    "decimals": 18
  },
  "networkId": 5177,
  "rpc": [
    "https://tlchain-network.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://5177.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet-rpc.tlxscan.com/"
  ],
  "shortName": "tlc",
  "slug": "tlchain-network",
  "testnet": false
} as const satisfies Chain;