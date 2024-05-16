import type { Chain } from "../src/types";
export default {
  "chain": "NEAR",
  "chainId": 1313161560,
  "explorers": [
    {
      "name": "PowerGold explorer",
      "url": "https://explorer.powergold.aurora.dev",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "infoURL": "https://www.powergold.tech",
  "name": "PowerGold",
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "networkId": 1313161560,
  "rpc": [
    "https://1313161560.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://powergold.aurora.dev"
  ],
  "shortName": "powergold",
  "slug": "powergold",
  "testnet": false
} as const satisfies Chain;