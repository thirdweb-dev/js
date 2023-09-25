import type { Chain } from "../src/types";
export default {
  "chainId": 1273227453,
  "chain": "wan-red-ain",
  "name": "HUMAN Protocol",
  "rpc": [
    "https://human-protocol.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet.skalenodes.com/v1/wan-red-ain"
  ],
  "slug": "human-protocol",
  "faucets": [
    "https://dashboard.humanprotocol.org/faucet"
  ],
  "nativeCurrency": {
    "name": "sFUEL",
    "symbol": "sFUEL",
    "decimals": 18
  },
  "infoURL": "https://www.humanprotocol.org",
  "shortName": "human-mainnet",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "Blockscout",
      "url": "https://wan-red-ain.explorer.mainnet.skalenodes.com",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;