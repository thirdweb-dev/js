import type { Chain } from "../types";
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
  "infoURL": "https://bmc.bytom.io/",
  "name": "BMC Testnet",
  "nativeCurrency": {
    "name": "BTM",
    "symbol": "BTM",
    "decimals": 18
  },
  "networkId": 189,
  "rpc": [
    "https://bmc-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://189.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet.bmcchain.com"
  ],
  "shortName": "BMCT",
  "slug": "bmc-testnet",
  "testnet": true
} as const satisfies Chain;