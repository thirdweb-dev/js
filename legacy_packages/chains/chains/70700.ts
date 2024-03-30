import type { Chain } from "../src/types";
export default {
  "chain": "ETH",
  "chainId": 70700,
  "explorers": [
    {
      "name": "Proof of Play Apex Explorer",
      "url": "https://explorer.apex.proofofplay.com",
      "standard": "EIP3091",
      "icon": {
        "url": "ipfs://QmW3NPDe6WRqucrWbe8pg3GqSMPi8V6Qa1fAiaQuqjxSJC",
        "width": 1256,
        "height": 1256,
        "format": "png"
      }
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://QmW3NPDe6WRqucrWbe8pg3GqSMPi8V6Qa1fAiaQuqjxSJC",
    "width": 1256,
    "height": 1256,
    "format": "png"
  },
  "infoURL": "https://proofofplay.com",
  "name": "Proof of Play - Apex",
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "networkId": 70700,
  "parent": {
    "type": "L2",
    "chain": "eip155-42161",
    "bridges": [
      {
        "url": "https://bridge.arbitrum.io"
      },
      {
        "url": "https://relay.link/bridge/apex/"
      }
    ]
  },
  "rpc": [
    "https://70700.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.apex.proofofplay.com"
  ],
  "shortName": "pop-apex",
  "slug": "proof-of-play-apex",
  "testnet": false
} as const satisfies Chain;