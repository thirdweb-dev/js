import type { Chain } from "../src/types";
export default {
  "chain": "Cyber",
  "chainId": 7560,
  "explorers": [
    {
      "name": "Cyber Mainnet Explorer",
      "url": "https://cyberscan.co",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://QmR8NuaSqALStb95YsMsJRG2BoYkibjS1XE1pZFtvEkAXY",
    "width": 213,
    "height": 212,
    "format": "svg"
  },
  "infoURL": "https://cyber.co/",
  "name": "Cyber Mainnet",
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "networkId": 7560,
  "parent": {
    "type": "L2",
    "chain": "eip155-1",
    "bridges": [
      {
        "url": "https://cyber.co/bridge"
      }
    ]
  },
  "rpc": [
    "https://7560.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://cyber.alt.technology/",
    "wss://cyber-ws.alt.technology/",
    "https://rpc.cyber.co/",
    "wss://rpc.cyber.co/"
  ],
  "shortName": "cyeth",
  "slug": "cyber",
  "testnet": false
} as const satisfies Chain;