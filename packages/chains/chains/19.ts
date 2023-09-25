import type { Chain } from "../src/types";
export default {
  "chainId": 19,
  "chain": "SGB",
  "name": "Songbird Canary-Network",
  "rpc": [
    "https://songbird-canary-network.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://songbird-api.flare.network/ext/C/rpc",
    "https://sgb.ftso.com.au/ext/bc/C/rpc",
    "https://sgb.lightft.so/rpc",
    "https://sgb-rpc.ftso.eu",
    "https://rpc.ftso.au/songbird"
  ],
  "slug": "songbird-canary-network",
  "icon": {
    "url": "ipfs://QmXyvnrZY8FUxSULfnKKA99sAEkjAHtvhRx5WeHixgaEdu",
    "width": 382,
    "height": 382,
    "format": "png"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "Songbird",
    "symbol": "SGB",
    "decimals": 18
  },
  "infoURL": "https://flare.xyz",
  "shortName": "sgb",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://songbird-explorer.flare.network",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;