import type { Chain } from "../src/types";
export default {
  "chainId": 5177,
  "chain": "TLC",
  "name": "TLChain Network Mainnet",
  "rpc": [
    "https://tlchain-network.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet-rpc.tlxscan.com/"
  ],
  "slug": "tlchain-network",
  "icon": {
    "url": "ipfs://QmaR5TsgnWSjLys6wGaciKUbc5qYL3Es4jtgQcosVqDWR3",
    "width": 2048,
    "height": 2048,
    "format": "png"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "TLChain Network",
    "symbol": "TLC",
    "decimals": 18
  },
  "infoURL": "https://tlchain.network/",
  "shortName": "tlc",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "TLChain Explorer",
      "url": "https://explorer.tlchain.network",
      "standard": "none"
    }
  ],
  "features": []
} as const satisfies Chain;