import type { Chain } from "../src/types";
export default {
  "chain": "Avalanche",
  "chainId": 26945,
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
  "name": "QA0628T1TS",
  "nativeCurrency": {
    "name": "QA0628T1TS Token",
    "symbol": "XMA",
    "decimals": 18
  },
  "networkId": 26945,
  "redFlags": [],
  "rpc": [
    "https://26945.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet-qa0628t1ts-y2910.avax-test.network/ext/bc/2WgEf3VjJnSco3BLZotyeypUeQ78s5tW3rj9AYyVM2PF9otzGJ/rpc?token=0d1c32abc584380568181cb037ae1aa23461acae7c46710b0245f64d34299faa"
  ],
  "shortName": "QA0628T1TS",
  "slug": "qa0628t1ts",
  "testnet": true
} as const satisfies Chain;