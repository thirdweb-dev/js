import type { Chain } from "../src/types";
export default {
  "chainId": 189,
  "chain": "BMC",
  "name": "BMC Testnet",
  "rpc": [
    "https://bmc-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet.bmcchain.com"
  ],
  "slug": "bmc-testnet",
  "faucets": [],
  "nativeCurrency": {
    "name": "BTM",
    "symbol": "BTM",
    "decimals": 18
  },
  "infoURL": "https://bmc.bytom.io/",
  "shortName": "BMCT",
  "testnet": true,
  "redFlags": [],
  "explorers": [
    {
      "name": "Blockmeta",
      "url": "https://bmctestnet.blockmeta.com",
      "standard": "none"
    }
  ],
  "features": []
} as const satisfies Chain;