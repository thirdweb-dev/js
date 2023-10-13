import type { Chain } from "../src/types";
export default {
  "chain": "BMC",
  "chainId": 188,
  "explorers": [
    {
      "name": "Blockmeta",
      "url": "https://bmc.blockmeta.com",
      "standard": "none"
    }
  ],
  "faucets": [],
  "features": [],
  "infoURL": "https://bmc.bytom.io/",
  "name": "BMC Mainnet",
  "nativeCurrency": {
    "name": "BTM",
    "symbol": "BTM",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://bmc.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet.bmcchain.com/"
  ],
  "shortName": "BMC",
  "slug": "bmc",
  "testnet": false
} as const satisfies Chain;