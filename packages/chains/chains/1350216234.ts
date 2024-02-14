import type { Chain } from "../src/types";
export default {
  "chain": "parallel-stormy-spica",
  "chainId": 1350216234,
  "explorers": [
    {
      "name": "Blockscout",
      "url": "https://parallel-stormy-spica.explorer.mainnet.skalenodes.com",
      "standard": "EIP3091"
    }
  ],
  "faucets": [
    "https://sfuel.skale.network/"
  ],
  "name": "SKALE Titan Hub",
  "nativeCurrency": {
    "name": "sFUEL",
    "symbol": "sFUEL",
    "decimals": 18
  },
  "networkId": 1350216234,
  "rpc": [
    "https://skale-titan-hub.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://1350216234.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet.skalenodes.com/v1/parallel-stormy-spica",
    "wss://mainnet.skalenodes.com/v1/ws/parallel-stormy-spica"
  ],
  "shortName": "titan-mainnet",
  "slug": "skale-titan-hub",
  "testnet": false
} as const satisfies Chain;