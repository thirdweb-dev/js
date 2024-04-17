import type { Chain } from "../src/types";
export default {
  "chain": "Avalanche",
  "chainId": 68688,
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
  "name": "Haku Chain Testnet",
  "nativeCurrency": {
    "name": "Haku Chain Testnet Token",
    "symbol": "HAKU",
    "decimals": 18
  },
  "networkId": 68688,
  "redFlags": [],
  "rpc": [
    "https://68688.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://subnets.avax.network/hakuchain/testnet/rpc"
  ],
  "shortName": "Haku Chain Testnet",
  "slug": "haku-chain-testnet",
  "testnet": true
} as const satisfies Chain;