import type { Chain } from "../src/types";
export default {
  "chain": "CFG",
  "chainId": 2031,
  "explorers": [
    {
      "name": "subscan",
      "url": "https://centrifuge.subscan.io",
      "standard": "EIP3091",
      "icon": {
        "url": "ipfs://Qma2GfW5nQHuA7nGqdEfwaXPL63G9oTwRTQKaGTfjNtM2W",
        "width": 400,
        "height": 400,
        "format": "png"
      }
    }
  ],
  "faucets": [],
  "features": [
    {
      "name": "EIP155"
    },
    {
      "name": "EIP1559"
    }
  ],
  "icon": {
    "url": "ipfs://QmedNc3WvTm66iNK2NYW6Fzu5tx5FgNa6HCBf3DTHpzQZ1",
    "width": 209,
    "height": 208,
    "format": "svg"
  },
  "infoURL": "https://centrifuge.io",
  "name": "Centrifuge",
  "nativeCurrency": {
    "name": "Centrifuge",
    "symbol": "CFG",
    "decimals": 18
  },
  "networkId": 2031,
  "rpc": [
    "wss://fullnode.parachain.centrifuge.io",
    "wss://centrifuge-parachain.api.onfinality.io/public-ws",
    "wss://centrifuge-rpc.dwellir.com",
    "wss://rpc-centrifuge.luckyfriday.io"
  ],
  "shortName": "cfg",
  "slug": "centrifuge",
  "testnet": false
} as const satisfies Chain;