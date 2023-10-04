import type { Chain } from "../src/types";
export default {
  "chain": "BMC",
  "chainId": 189,
  "explorers": [
    {
      "name": "Blockmeta",
      "url": "https://bmctestnet.blockmeta.com",
      "standard": "none"
    }
  ],
  "faucets": [],
  "features": [],
  "infoURL": "https://bmc.bytom.io/",
  "name": "BMC Testnet",
  "nativeCurrency": {
    "name": "BTM",
    "symbol": "BTM",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://bmc-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet.bmcchain.com"
  ],
  "shortName": "BMCT",
  "slug": "bmc-testnet",
  "testnet": true
} as const satisfies Chain;