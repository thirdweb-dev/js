import type { Chain } from "../src/types";
export default {
  "name": "Anduschain Mainnet",
  "chain": "anduschain",
  "rpc": [
    "https://anduschain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.anduschain.io/rpc",
    "wss://rpc.anduschain.io/ws"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "DAON",
    "symbol": "DEB",
    "decimals": 18
  },
  "infoURL": "https://anduschain.io/",
  "shortName": "anduschain-mainnet",
  "chainId": 14288640,
  "networkId": 14288640,
  "explorers": [
    {
      "name": "anduschain explorer",
      "url": "https://explorer.anduschain.io",
      "icon": {
        "url": "ipfs://bafkreiapaxokh2p4j7hg43ug2inomixiwrdhni4kpqazvqifssnez7efze",
        "width": 512,
        "height": 512,
        "format": "png"
      },
      "standard": "none"
    }
  ],
  "testnet": false,
  "slug": "anduschain"
} as const satisfies Chain;