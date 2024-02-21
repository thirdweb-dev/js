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
  "infoURL": "https://bmc.bytom.io/",
  "name": "BMC Mainnet",
  "nativeCurrency": {
    "name": "BTM",
    "symbol": "BTM",
    "decimals": 18
  },
  "networkId": 188,
  "rpc": [
    "https://188.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet.bmcchain.com/"
  ],
  "shortName": "BMC",
  "slug": "bmc",
  "testnet": false
} as const satisfies Chain;