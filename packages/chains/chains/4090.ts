import type { Chain } from "../src/types";
export default {
  "chainId": 4090,
  "chain": "Fastex Chain (Bahamut)",
  "name": "Fastex Chain (Bahamut) Oasis Testnet",
  "rpc": [
    "https://fastex-chain-bahamut-oasis-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc1.oasis.bahamutchain.com"
  ],
  "slug": "fastex-chain-bahamut-oasis-testnet",
  "icon": {
    "url": "ipfs://QmSemioP83RXnDWwTZbet8VpwJxcFRboX4B3pcdhLZGodP",
    "width": 200,
    "height": 200,
    "format": "png"
  },
  "faucets": [
    "https://faucet.oasis.fastexchain.com"
  ],
  "nativeCurrency": {
    "name": "FTN",
    "symbol": "FTN",
    "decimals": 18
  },
  "infoURL": "https://fastexchain.com",
  "shortName": "Oasis",
  "testnet": true,
  "redFlags": [],
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://oasis.ftnscan.com",
      "standard": "none"
    }
  ],
  "features": [
    {
      "name": "EIP155"
    },
    {
      "name": "EIP1559"
    }
  ]
} as const satisfies Chain;