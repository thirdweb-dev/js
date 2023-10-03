import type { Chain } from "../src/types";
export default {
  "chain": "SGB",
  "chainId": 19,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://songbird-explorer.flare.network",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "features": [],
  "icon": {
    "url": "ipfs://QmXyvnrZY8FUxSULfnKKA99sAEkjAHtvhRx5WeHixgaEdu",
    "width": 382,
    "height": 382,
    "format": "png"
  },
  "infoURL": "https://flare.xyz",
  "name": "Songbird Canary-Network",
  "nativeCurrency": {
    "name": "Songbird",
    "symbol": "SGB",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://songbird-canary-network.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://songbird-api.flare.network/ext/C/rpc",
    "https://sgb.ftso.com.au/ext/bc/C/rpc",
    "https://sgb.lightft.so/rpc",
    "https://sgb-rpc.ftso.eu",
    "https://rpc.ftso.au/songbird"
  ],
  "shortName": "sgb",
  "slug": "songbird-canary-network",
  "testnet": false
} as const satisfies Chain;