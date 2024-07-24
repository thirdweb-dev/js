import type { Chain } from "../src/types";
export default {
  "chain": "ETH",
  "chainId": 77677,
  "explorers": [],
  "faucets": [],
  "icon": {
    "url": "ipfs://QmeC4mKGbBpwmLfFxUSsareWkSWJomevUmex8ajjxo1zHx",
    "width": 500,
    "height": 500,
    "format": "png"
  },
  "infoURL": "https://www.cyclenetwork.io/",
  "name": "Cycle Network Mainnet Sailboat",
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "networkId": 77677,
  "rpc": [
    "https://77677.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://sailboat-rpc-mainnet.cyclenetwork.io"
  ],
  "shortName": "cycles",
  "slug": "cycle-network-sailboat",
  "testnet": false
} as const satisfies Chain;