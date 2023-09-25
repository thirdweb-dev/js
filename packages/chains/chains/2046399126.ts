import type { Chain } from "../src/types";
export default {
  "chainId": 2046399126,
  "chain": "europa",
  "name": "Europa SKALE Chain",
  "rpc": [
    "https://europa-skale-chain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet.skalenodes.com/v1/elated-tan-skat",
    "wss://mainnet.skalenodes.com/v1/elated-tan-skat"
  ],
  "slug": "europa-skale-chain",
  "icon": {
    "url": "ipfs://bafkreiezcwowhm6xjrkt44cmiu6ml36rhrxx3amcg3cfkcntv2vgcvgbre",
    "width": 600,
    "height": 600,
    "format": "png"
  },
  "faucets": [
    "https://ruby.exchange/faucet.html",
    "https://sfuel.mylilius.com/"
  ],
  "nativeCurrency": {
    "name": "sFUEL",
    "symbol": "sFUEL",
    "decimals": 18
  },
  "infoURL": "https://europahub.network/",
  "shortName": "europa",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "Blockscout",
      "url": "https://elated-tan-skat.explorer.mainnet.skalenodes.com",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;