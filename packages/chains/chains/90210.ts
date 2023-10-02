import type { Chain } from "../src/types";
export default {
  "chain": "ETH",
  "chainId": 90210,
  "explorers": [
    {
      "name": "Beverly Hills explorer",
      "url": "https://explorer.beverlyhills.ethdevops.io",
      "standard": "none"
    }
  ],
  "faucets": [
    "https://faucet.beverlyhills.ethdevops.io"
  ],
  "features": [],
  "infoURL": "https://beverlyhills.ethdevops.io",
  "name": "Beverly Hills",
  "nativeCurrency": {
    "name": "Beverly Hills Testnet Ether",
    "symbol": "BVE",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://beverly-hills.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.beverlyhills.ethdevops.io:8545"
  ],
  "shortName": "bvhl",
  "slug": "beverly-hills",
  "status": "incubating",
  "testnet": true
} as const satisfies Chain;