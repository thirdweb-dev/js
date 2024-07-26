import type { Chain } from "../src/types";
export default {
  "chain": "Avalanche",
  "chainId": 87566,
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
  "name": "Eun Kyu's",
  "nativeCurrency": {
    "name": "Eun Kyu's Token",
    "symbol": "EKY",
    "decimals": 18
  },
  "networkId": 87566,
  "redFlags": [],
  "rpc": [
    "https://87566.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet-eunkyu-w0354.avax-test.network/ext/bc/2EWNDiAUH6WLaJ4zbbjzqRgJjAqygtwPh6zKTsNRK7DaSCEn9e/rpc?token=737d2a8644ac84c1f04ff511430c2b1e1ac5924b803776f93ad665289df5a7c3"
  ],
  "shortName": "Eun Kyu's",
  "slug": "eun-kyu-s",
  "testnet": true
} as const satisfies Chain;