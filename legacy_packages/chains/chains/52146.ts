import type { Chain } from "../src/types";
export default {
  "chain": "Avalanche",
  "chainId": 52146,
  "explorers": [],
  "faucets": [],
  "features": [],
  "icon": {
    "url": "https://images.ctfassets.net/9bazykntljf6/62CceHSYsRS4D9fgDSkLRB/877cb8f26954e1743ff535fd7fdaf78f/avacloud-placeholder.svg",
    "width": 256,
    "height": 256,
    "format": "svg"
  },
  "infoURL": "https://avacloud.io",
  "name": "QaUser4359 Testnet",
  "nativeCurrency": {
    "name": "QaUser4359 Testnet Token",
    "symbol": "WBP",
    "decimals": 18
  },
  "networkId": 52146,
  "redFlags": [],
  "rpc": [
    "https://52146.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://subnets.avax.network/defi-kingdoms/dfk-chain/rpc"
  ],
  "shortName": "QaUser4359 Testnet",
  "slug": "qauser4359-testnet",
  "testnet": true
} as const satisfies Chain;