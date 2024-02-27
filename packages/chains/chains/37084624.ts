import type { Chain } from "../src/types";
export default {
  "chain": "lanky-ill-funny-testnet",
  "chainId": 37084624,
  "explorers": [
    {
      "name": "Blockscout",
      "url": "https://lanky-ill-funny-testnet.explorer.testnet.skalenodes.com",
      "standard": "EIP3091"
    }
  ],
  "faucets": [
    "https://www.sfuelstation.com/"
  ],
  "icon": {
    "url": "ipfs://bafybeic5eexvd34wfy4kuebcyu73qpkv3x57s54ebzjyhyjsmeuni5jwcm",
    "width": 500,
    "height": 500,
    "format": "png"
  },
  "infoURL": "https://nebulachain.io/",
  "name": "SKALE Nebula Hub Testnet",
  "nativeCurrency": {
    "name": "sFUEL",
    "symbol": "sFUEL",
    "decimals": 18
  },
  "networkId": 37084624,
  "rpc": [
    "https://37084624.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet.skalenodes.com/v1/lanky-ill-funny-testnet",
    "wss://testnet.skalenodes.com/v1/ws/lanky-ill-funny-testnet"
  ],
  "shortName": "nebula-testnet",
  "slip44": 1,
  "slug": "skale-nebula-hub-testnet",
  "testnet": true,
  "title": "SKALE Nebula Hub Testnet"
} as const satisfies Chain;