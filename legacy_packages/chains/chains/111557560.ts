import type { Chain } from "../src/types";
export default {
  "chain": "Cyber",
  "chainId": 111557560,
  "explorers": [
    {
      "name": "Cyber Testnet Explorer",
      "url": "https://testnet.cyberscan.co",
      "standard": "EIP3091",
      "icon": {
        "url": "ipfs://QmYtUimyqHkkFxYdbXXRbUqNg2VLPUg6Uu2C2nmFWowiZM",
        "width": 551,
        "height": 540,
        "format": "png"
      }
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://QmP61yDNPv7fxY9ZzPs4CjQDbZLoKtF8eWWjszVYbwkabd",
    "width": 1000,
    "height": 1000,
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
        "url": "https://op-bridge.alt.technology/deposit?id=111557560"
      }
    ]
  },
  "rpc": [
    "https://111557560.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://cyber-testnet.alt.technology/",
    "wss://cyber-testnet.alt.technology/ws"
  ],
  "shortName": "cysep",
  "slug": "cyber-testnet",
  "testnet": true
} as const satisfies Chain;