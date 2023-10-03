import type { Chain } from "../src/types";
export default {
  "chain": "Fastex Chain (Bahamut)",
  "chainId": 4090,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://oasis.ftnscan.com",
      "standard": "none"
    }
  ],
  "faucets": [
    "https://faucet.oasis.fastexchain.com"
  ],
  "features": [
    {
      "name": "EIP155"
    },
    {
      "name": "EIP1559"
    }
  ],
  "icon": {
    "url": "ipfs://QmSemioP83RXnDWwTZbet8VpwJxcFRboX4B3pcdhLZGodP",
    "width": 200,
    "height": 200,
    "format": "png"
  },
  "infoURL": "https://fastexchain.com",
  "name": "Fastex Chain (Bahamut) Oasis Testnet",
  "nativeCurrency": {
    "name": "FTN",
    "symbol": "FTN",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://fastex-chain-bahamut-oasis-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc1.oasis.bahamutchain.com"
  ],
  "shortName": "Oasis",
  "slug": "fastex-chain-bahamut-oasis-testnet",
  "testnet": true
} as const satisfies Chain;