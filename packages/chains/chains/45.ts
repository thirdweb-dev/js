import type { Chain } from "../src/types";
export default {
  "name": "Darwinia Pangoro Testnet",
  "chain": "pangoro",
  "rpc": [
    "https://darwinia-pangoro-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://pangoro-rpc.darwinia.network"
  ],
  "faucets": [
    "https://docs.darwinia.network/pangoro-testnet-70cfec5dc9ca42759959ba3803edaec2"
  ],
  "nativeCurrency": {
    "name": "Pangoro Network Native Token",
    "symbol": "ORING",
    "decimals": 18
  },
  "infoURL": "https://darwinia.network/",
  "shortName": "pangoro",
  "chainId": 45,
  "networkId": 45,
  "explorers": [
    {
      "name": "subscan",
      "url": "https://pangoro.subscan.io",
      "standard": "none"
    }
  ],
  "testnet": true,
  "slug": "darwinia-pangoro-testnet"
} as const satisfies Chain;