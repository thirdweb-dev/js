import type { Chain } from "../src/types";
export default {
  "chain": "ETH",
  "chainId": 1223,
  "explorers": [],
  "faucets": [],
  "icon": {
    "url": "ipfs://QmeC4mKGbBpwmLfFxUSsareWkSWJomevUmex8ajjxo1zHx",
    "width": 500,
    "height": 500,
    "format": "png"
  },
  "infoURL": "https://www.cyclenetwork.io/",
  "name": "Cycle Network Testnet Jellyfish",
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "networkId": 1223,
  "rpc": [
    "https://1223.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://jellyfish-rpc-testnet.cyclenetwork.io"
  ],
  "shortName": "cyclej",
  "slug": "cycle-network-testnet-jellyfish",
  "testnet": true
} as const satisfies Chain;