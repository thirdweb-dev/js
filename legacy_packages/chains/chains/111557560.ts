import type { Chain } from "../src/types";
export default {
  "chain": "Cyber",
  "chainId": 111557560,
  "explorers": [
    {
      "name": "Cyber Testnet Explorer",
      "url": "https://testnet.cyberscan.co",
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
  "name": "Cyber Testnet",
  "nativeCurrency": {
    "name": "Sepolia Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "networkId": 111557560,
  "parent": {
    "type": "L2",
    "chain": "eip155-11155111",
    "bridges": [
      {
        "url": "https://cyber-testnet.testnets.rollbridge.app/"
      }
    ]
  },
  "rpc": [
    "https://111557560.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://cyber-testnet.alt.technology/",
    "wss://cyber-testnet.alt.technology/ws",
    "https://rpc.testnet.cyber.co/",
    "wss://rpc.testnet.cyber.co/"
  ],
  "shortName": "cysep",
  "slug": "cyber-testnet",
  "testnet": true
} as const satisfies Chain;