import type { Chain } from "../src/types";
export default {
  "chainId": 90210,
  "chain": "ETH",
  "name": "Beverly Hills",
  "rpc": [
    "https://beverly-hills.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.beverlyhills.ethdevops.io:8545"
  ],
  "slug": "beverly-hills",
  "faucets": [
    "https://faucet.beverlyhills.ethdevops.io"
  ],
  "nativeCurrency": {
    "name": "Beverly Hills Testnet Ether",
    "symbol": "BVE",
    "decimals": 18
  },
  "infoURL": "https://beverlyhills.ethdevops.io",
  "shortName": "bvhl",
  "testnet": true,
  "status": "incubating",
  "redFlags": [],
  "explorers": [
    {
      "name": "Beverly Hills explorer",
      "url": "https://explorer.beverlyhills.ethdevops.io",
      "standard": "none"
    }
  ],
  "features": []
} as const satisfies Chain;