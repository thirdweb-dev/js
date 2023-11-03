import type { Chain } from "../types";
export default {
  "chain": "europa",
  "chainId": 2046399126,
  "explorers": [
    {
      "name": "Blockscout",
      "url": "https://elated-tan-skat.explorer.mainnet.skalenodes.com",
      "standard": "EIP3091"
    }
  ],
  "faucets": [
    "https://ruby.exchange/faucet.html",
    "https://sfuel.mylilius.com/"
  ],
  "icon": {
    "url": "ipfs://bafkreiezcwowhm6xjrkt44cmiu6ml36rhrxx3amcg3cfkcntv2vgcvgbre",
    "width": 600,
    "height": 600,
    "format": "png"
  },
  "infoURL": "https://europahub.network/",
  "name": "Europa SKALE Chain",
  "nativeCurrency": {
    "name": "sFUEL",
    "symbol": "sFUEL",
    "decimals": 18
  },
  "networkId": 2046399126,
  "parent": {
    "type": "L2",
    "chain": "eip155-1",
    "bridges": [
      {
        "url": "https://ruby.exchange/bridge.html"
      }
    ]
  },
  "rpc": [
    "https://europa-skale-chain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://2046399126.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet.skalenodes.com/v1/elated-tan-skat",
    "wss://mainnet.skalenodes.com/v1/elated-tan-skat"
  ],
  "shortName": "europa",
  "slug": "europa-skale-chain",
  "testnet": false
} as const satisfies Chain;