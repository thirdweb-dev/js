import type { Chain } from "../src/types";
export default {
  "chain": "Avalanche",
  "chainId": 86162,
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
  "name": "Apiary",
  "nativeCurrency": {
    "name": "Apiary Token",
    "symbol": "APIARY",
    "decimals": 18
  },
  "networkId": 86162,
  "redFlags": [],
  "rpc": [
    "https://86162.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet-apiary-yfd1b.avax-test.network/ext/bc/cfGi1UzcKyVJuJki7dY495hKCXSH9wuyvV1EsD5CT63FLDu3f/rpc?token=0d7db5569e966aa69a6546107e69278f45a53068a5227fa48ba8485ffe629568"
  ],
  "shortName": "Apiary",
  "slug": "apiary",
  "testnet": true
} as const satisfies Chain;