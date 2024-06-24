import type { Chain } from "../src/types";
export default {
  "chain": "Avalanche",
  "chainId": 954958,
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
  "name": "QA0621T1TS",
  "nativeCurrency": {
    "name": "QA0621T1TS Token",
    "symbol": "FNF",
    "decimals": 18
  },
  "networkId": 954958,
  "redFlags": [],
  "rpc": [
    "https://954958.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet-qa0621t1ts-z3001.avax-test.network/ext/bc/TXRuQxeHnyh6CGR6DgLdC5s2WSiHF3a5pK2DEurPaVjgzxshD/rpc?token=18a44f4988cdf732a71dc730f51e89eedade77024c23618cbd89e04779a078b9"
  ],
  "shortName": "QA0621T1TS",
  "slug": "qa0621t1ts",
  "testnet": true
} as const satisfies Chain;