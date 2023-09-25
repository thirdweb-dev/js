import type { Chain } from "../src/types";
export default {
  "chainId": 188,
  "chain": "BMC",
  "name": "BMC Mainnet",
  "rpc": [
    "https://bmc.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet.bmcchain.com/"
  ],
  "slug": "bmc",
  "faucets": [],
  "nativeCurrency": {
    "name": "BTM",
    "symbol": "BTM",
    "decimals": 18
  },
  "infoURL": "https://bmc.bytom.io/",
  "shortName": "BMC",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "Blockmeta",
      "url": "https://bmc.blockmeta.com",
      "standard": "none"
    }
  ],
  "features": []
} as const satisfies Chain;