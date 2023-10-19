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
  "features": [],
  "infoURL": "https://beagle.chat/",
  "name": "Beagle Messaging Chain",
  "nativeCurrency": {
    "name": "Beagle",
    "symbol": "BG",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://beagle-messaging-chain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://beagle.chat/eth"
  ],
  "shortName": "beagle",
  "slug": "beagle-messaging-chain",
  "testnet": false
} as const satisfies Chain;