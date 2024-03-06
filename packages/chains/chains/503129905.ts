import type { Chain } from "../src/types";
export default {
  "chain": "staging-faint-slimy-achird",
  "chainId": 503129905,
  "explorers": [
    {
      "name": "Blockscout",
      "url": "https://staging-faint-slimy-achird.explorer.staging-v3.skalenodes.com",
      "standard": "EIP3091"
    }
  ],
  "faucets": [
    "https://sfuel.dirtroad.dev/staging"
  ],
  "icon": {
    "url": "ipfs://bafybeic5eexvd34wfy4kuebcyu73qpkv3x57s54ebzjyhyjsmeuni5jwcm",
    "width": 500,
    "height": 500,
    "format": "png"
  },
  "infoURL": "https://nebulachain.io/",
  "name": "Deprecated SKALE Nebula Hub Testnet",
  "nativeCurrency": {
    "name": "sFUEL",
    "symbol": "sFUEL",
    "decimals": 18
  },
  "networkId": 503129905,
  "rpc": [
    "https://503129905.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://staging-v3.skalenodes.com/v1/staging-faint-slimy-achird",
    "wss://staging-v3.skalenodes.com/v1/ws/staging-faint-slimy-achird"
  ],
  "shortName": "deprecated-nebula-testnet",
  "slip44": 1,
  "slug": "deprecated-skale-nebula-hub-testnet",
  "status": "deprecated",
  "testnet": true
} as const satisfies Chain;