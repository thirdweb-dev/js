import type { Chain } from "../src/types";
export default {
  "chain": "ETH",
  "chainId": 6022140761023,
  "explorers": [],
  "faucets": [],
  "infoURL": "https://github.com/Jdubedition/molereum",
  "name": "Molereum Network",
  "nativeCurrency": {
    "name": "Molereum Ether",
    "symbol": "MOLE",
    "decimals": 18
  },
  "networkId": 6022140761023,
  "rpc": [
    "https://molereum-network.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://6022140761023.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://molereum.jdubedition.com"
  ],
  "shortName": "mole",
  "slug": "molereum-network",
  "testnet": false
} as const satisfies Chain;