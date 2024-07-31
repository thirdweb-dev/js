import type { Chain } from "../src/types";
export default {
  "chain": "Avalanche",
  "chainId": 65622,
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
  "name": "Live Stripe Test",
  "nativeCurrency": {
    "name": "Live Stripe Test Token",
    "symbol": "LST",
    "decimals": 18
  },
  "networkId": 65622,
  "redFlags": [],
  "rpc": [
    "https://65622.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://subnets.avax.network/livestripe/testnet/rpc"
  ],
  "shortName": "Live Stripe Test",
  "slug": "live-stripe-test",
  "testnet": true
} as const satisfies Chain;