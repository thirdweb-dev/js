import type { Chain } from "../src/types";
export default {
  "chainId": 246785,
  "chain": "ARTIS",
  "name": "ARTIS Testnet tau1",
  "rpc": [
    "https://artis-testnet-tau1.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.tau1.artis.network"
  ],
  "slug": "artis-testnet-tau1",
  "faucets": [],
  "nativeCurrency": {
    "name": "ARTIS tau1 Ether",
    "symbol": "tATS",
    "decimals": 18
  },
  "infoURL": "https://artis.network",
  "shortName": "atstau",
  "testnet": true,
  "redFlags": [],
  "explorers": [],
  "features": []
} as const satisfies Chain;