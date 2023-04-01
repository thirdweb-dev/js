import type { Chain } from "../src/types";
export default {
  "name": "Beagle Messaging Chain",
  "chain": "BMC",
  "rpc": [],
  "faucets": [
    "https://faucet.beagle.chat/"
  ],
  "nativeCurrency": {
    "name": "Beagle",
    "symbol": "BG",
    "decimals": 18
  },
  "infoURL": "https://beagle.chat/",
  "shortName": "beagle",
  "chainId": 1515,
  "networkId": 1515,
  "explorers": [
    {
      "name": "Beagle Messaging Chain Explorer",
      "url": "https://eth.beagle.chat",
      "standard": "EIP3091"
    }
  ],
  "testnet": false,
  "slug": "beagle-messaging-chain"
} as const satisfies Chain;