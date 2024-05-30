import type { Chain } from "../src/types";
export default {
  "chain": "CBR",
  "chainId": 4040,
  "explorers": [
    {
      "name": "Carbonium Network tesnet Explorer",
      "url": "https://testnet.carboniumscan.com",
      "standard": "none"
    }
  ],
  "faucets": [
    "https://getfaucet.carbonium.network"
  ],
  "infoURL": "https://carbonium.network",
  "name": "Carbonium Testnet Network",
  "nativeCurrency": {
    "name": "Carbonium",
    "symbol": "tCBR",
    "decimals": 18
  },
  "networkId": 4040,
  "rpc": [
    "https://4040.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc-dev.carbonium.network/",
    "https://server-testnet.carbonium.network"
  ],
  "shortName": "tcbr",
  "slip44": 1,
  "slug": "carbonium-testnet-network",
  "testnet": true
} as const satisfies Chain;