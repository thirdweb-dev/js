import type { Chain } from "../src/types";
export default {
  "chain": "MAPO",
  "chainId": 212,
  "explorers": [
    {
      "name": "maposcan",
      "url": "https://testnet.maposcan.io",
      "standard": "EIP3091"
    }
  ],
  "faucets": [
    "https://faucet.mapprotocol.io"
  ],
  "infoURL": "https://mapprotocol.io/",
  "name": "MAPO Makalu",
  "nativeCurrency": {
    "name": "Makalu MAPO",
    "symbol": "MAPO",
    "decimals": 18
  },
  "networkId": 212,
  "rpc": [
    "https://212.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet-rpc.maplabs.io"
  ],
  "shortName": "makalu",
  "slug": "mapo-makalu",
  "testnet": true,
  "title": "MAPO Testnet Makalu"
} as const satisfies Chain;