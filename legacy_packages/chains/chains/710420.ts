import type { Chain } from "../src/types";
export default {
  "chain": "Avalanche",
  "chainId": 710420,
  "explorers": [
    {
      "name": "TILTYARD Explorer",
      "url": "https://subnets.avax.network/tiltyard",
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
    "url": "https://images.ctfassets.net/9bazykntljf6/62CceHSYsRS4D9fgDSkLRB/877cb8f26954e1743ff535fd7fdaf78f/avacloud-placeholder.svg",
    "width": 256,
    "height": 256,
    "format": "svg"
  },
  "infoURL": "https://avacloud.io",
  "name": "Tiltyard",
  "nativeCurrency": {
    "name": "Tiltyard Token",
    "symbol": "TILT",
    "decimals": 18
  },
  "networkId": 710420,
  "redFlags": [],
  "rpc": [
    "https://710420.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://subnets.avax.network/tiltyard/mainnet/rpc"
  ],
  "shortName": "Tiltyard",
  "slug": "tiltyard",
  "testnet": false
} as const satisfies Chain;