import type { Chain } from "../src/types";
export default {
  "chain": "wan-red-ain",
  "chainId": 1273227453,
  "explorers": [
    {
      "name": "Blockscout",
      "url": "https://wan-red-ain.explorer.mainnet.skalenodes.com",
      "standard": "EIP3091"
    }
  ],
  "faucets": [
    "https://dashboard.humanprotocol.org/faucet"
  ],
  "features": [],
  "infoURL": "https://www.humanprotocol.org",
  "name": "HUMAN Protocol",
  "nativeCurrency": {
    "name": "sFUEL",
    "symbol": "sFUEL",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://human-protocol.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet.skalenodes.com/v1/wan-red-ain"
  ],
  "shortName": "human-mainnet",
  "slug": "human-protocol",
  "testnet": false
} as const satisfies Chain;