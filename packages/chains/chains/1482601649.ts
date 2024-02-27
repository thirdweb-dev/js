import type { Chain } from "../src/types";
export default {
  "chain": "green-giddy-denebola",
  "chainId": 1482601649,
  "explorers": [
    {
      "name": "Blockscout",
      "url": "https://green-giddy-denebola.explorer.mainnet.skalenodes.com",
      "standard": "EIP3091"
    }
  ],
  "faucets": [
    "https://sfuel.skale.network/"
  ],
  "icon": {
    "url": "ipfs://bafybeic5eexvd34wfy4kuebcyu73qpkv3x57s54ebzjyhyjsmeuni5jwcm",
    "width": 500,
    "height": 500,
    "format": "png"
  },
  "infoURL": "https://nebulachain.io/",
  "name": "SKALE Nebula Hub",
  "nativeCurrency": {
    "name": "sFUEL",
    "symbol": "sFUEL",
    "decimals": 18
  },
  "networkId": 1482601649,
  "rpc": [
    "https://1482601649.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet.skalenodes.com/v1/green-giddy-denebola",
    "wss://mainnet-proxy.skalenodes.com/v1/ws/green-giddy-denebola"
  ],
  "shortName": "nebula-mainnet",
  "slug": "skale-nebula-hub",
  "testnet": false
} as const satisfies Chain;