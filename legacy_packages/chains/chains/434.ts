import type { Chain } from "../src/types";
export default {
  "chain": "BYC",
  "chainId": 434,
  "explorers": [
    {
      "name": "Boyaa explorer",
      "url": "https://explorer.mainnet.boyaa.network",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://bafybeiapootrvggtigdlvgvk6srfseplpuowsqq3zpyup4j5yj5moxuala",
    "width": 500,
    "height": 500,
    "format": "png"
  },
  "infoURL": "https://boyaa.network",
  "name": "Boyaa Mainnet",
  "nativeCurrency": {
    "name": "Boyaa mainnet native coin",
    "symbol": "BYC",
    "decimals": 18
  },
  "networkId": 434,
  "rpc": [
    "https://434.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://evm-rpc.mainnet.boyaa.network"
  ],
  "shortName": "BYC",
  "slug": "boyaa",
  "testnet": false
} as const satisfies Chain;