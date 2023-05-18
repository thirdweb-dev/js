import type { Chain } from "../src/types";
export default {
  "name": "Fastex Chain (Bahamut) Oasis Testnet",
  "title": "Bahamut testnet Oasis",
  "icon": {
    "url": "ipfs://QmSemioP83RXnDWwTZbet8VpwJxcFRboX4B3pcdhLZGodP",
    "width": 200,
    "height": 200,
    "format": "png"
  },
  "chain": "Fastex Chain (Bahamut)",
  "rpc": [
    "https://fastex-chain-bahamut-oasis-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc1.oasis.bahamutchain.com"
  ],
  "features": [
    {
      "name": "EIP155"
    },
    {
      "name": "EIP1559"
    }
  ],
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
  "chainId": 4090,
  "networkId": 4090,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://oasis.ftnscan.com",
      "standard": "none"
    }
  ],
  "testnet": true,
  "slug": "fastex-chain-bahamut-oasis-testnet"
} as const satisfies Chain;