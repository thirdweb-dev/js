import type { Chain } from "../src/types";
export default {
  "chain": "Hubblenet",
  "chainId": 1992,
  "explorers": [
    {
      "name": "routescan",
      "url": "https://explorer.hubble.exchange",
      "standard": "EIP3091"
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
    "url": "ipfs://QmU9t9fZaWiqpAZ9dw2ojTpJycnB8BxekLWVSCJikJVgjW",
    "width": 512,
    "height": 512,
    "format": "png"
  },
  "infoURL": "https://www.hubble.exchange",
  "name": "Hubble Exchange",
  "nativeCurrency": {
    "name": "USD Coin",
    "symbol": "USDC",
    "decimals": 18
  },
  "networkId": 1992,
  "rpc": [
    "https://1992.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.hubble.exchange",
    "wss://ws-rpc.hubble.exchange"
  ],
  "shortName": "hubblenet",
  "slip44": 60,
  "slug": "hubble-exchange",
  "testnet": false
} as const satisfies Chain;