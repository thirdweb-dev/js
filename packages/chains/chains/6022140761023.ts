import type { Chain } from "../src/types";
export default {
  "chainId": 6022140761023,
  "chain": "ETH",
  "name": "Molereum Network",
  "rpc": [
    "https://molereum-network.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://molereum.jdubedition.com"
  ],
  "slug": "molereum-network",
  "faucets": [],
  "nativeCurrency": {
    "name": "Molereum Ether",
    "symbol": "MOLE",
    "decimals": 18
  },
  "infoURL": "https://github.com/Jdubedition/molereum",
  "shortName": "mole",
  "testnet": false,
  "redFlags": [],
  "explorers": [],
  "features": []
} as const satisfies Chain;