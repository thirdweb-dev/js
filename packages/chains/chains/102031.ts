import type { Chain } from "../src/types";
export default {
  "chain": "CTC",
  "chainId": 102031,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://creditcoin-testnet.blockscout.com",
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
  "features": [
    {
      "name": "EIP155"
    },
    {
      "name": "EIP1559"
    }
  ],
  "icon": {
    "url": "ipfs://QmTfecECALDCy51zwVbXBSXb6TokqowCYzVLv65etahLxX",
    "width": 1024,
    "height": 1024,
    "format": "png"
  },
  "infoURL": "https://creditcoin.org",
  "name": "Creditcoin Testnet",
  "nativeCurrency": {
    "name": "Testnet CTC",
    "symbol": "tCTC",
    "decimals": 18
  },
  "networkId": 102031,
  "rpc": [
    "https://102031.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.cc3-testnet.creditcoin.network"
  ],
  "shortName": "ctctest",
  "slug": "creditcoin-testnet",
  "testnet": true
} as const satisfies Chain;