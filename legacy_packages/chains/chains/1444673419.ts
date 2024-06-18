import type { Chain } from "../src/types";
export default {
  "chain": "juicy-low-small-testnet",
  "chainId": 1444673419,
  "explorers": [
    {
      "name": "Blockscout",
      "url": "https://juicy-low-small-testnet.explorer.testnet.skalenodes.com",
      "standard": "EIP3091"
    }
  ],
  "faucets": [
    "https://www.sfuelstation.com/"
  ],
  "icon": {
    "url": "ipfs://bafkreiezcwowhm6xjrkt44cmiu6ml36rhrxx3amcg3cfkcntv2vgcvgbre",
    "width": 600,
    "height": 600,
    "format": "png"
  },
  "infoURL": "https://europahub.network/",
  "name": "SKALE Europa Hub Testnet",
  "nativeCurrency": {
    "name": "sFUEL",
    "symbol": "sFUEL",
    "decimals": 18
  },
  "networkId": 1444673419,
  "rpc": [
    "https://1444673419.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet.skalenodes.com/v1/juicy-low-small-testnet"
  ],
  "shortName": "europa-testnet",
  "slip44": 1,
  "slug": "skale-europa-hub-testnet",
  "testnet": true,
  "title": "SKALE Europa Hub Testnet"
} as const satisfies Chain;