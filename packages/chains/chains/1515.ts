import type { Chain } from "../src/types";
export default {
  "chainId": 1515,
  "chain": "BMC",
  "name": "Beagle Messaging Chain",
  "rpc": [
    "https://beagle-messaging-chain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://beagle.chat/eth"
  ],
  "slug": "beagle-messaging-chain",
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
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "Beagle Messaging Chain Explorer",
      "url": "https://eth.beagle.chat",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;