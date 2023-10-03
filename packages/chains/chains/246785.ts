import type { Chain } from "../src/types";
export default {
  "chain": "ARTIS",
  "chainId": 246785,
  "explorers": [],
  "faucets": [],
  "features": [],
  "infoURL": "https://artis.network",
  "name": "ARTIS Testnet tau1",
  "nativeCurrency": {
    "name": "ARTIS tau1 Ether",
    "symbol": "tATS",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://artis-testnet-tau1.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.tau1.artis.network"
  ],
  "shortName": "atstau",
  "slug": "artis-testnet-tau1",
  "testnet": true
} as const satisfies Chain;