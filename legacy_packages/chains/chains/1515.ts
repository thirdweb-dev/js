import type { Chain } from "../src/types";
export default {
  "chain": "BMC",
  "chainId": 1515,
  "explorers": [
    {
      "name": "Beagle Messaging Chain Explorer",
      "url": "https://eth.beagle.chat",
      "standard": "EIP3091"
    }
  ],
  "faucets": [
    "https://faucet.beagle.chat/"
  ],
  "infoURL": "https://beagle.chat/",
  "name": "Beagle Messaging Chain",
  "nativeCurrency": {
    "name": "Beagle",
    "symbol": "BG",
    "decimals": 18
  },
  "networkId": 1515,
  "rpc": [
    "https://1515.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://beagle.chat/eth"
  ],
  "shortName": "beagle",
  "slug": "beagle-messaging-chain",
  "testnet": false
} as const satisfies Chain;