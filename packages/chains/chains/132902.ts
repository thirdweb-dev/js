import type { Chain } from "../src/types";
export default {
  "chain": "Form",
  "chainId": 132902,
  "explorers": [],
  "faucets": [
    "https://info.form.network/faucet"
  ],
  "features": [],
  "icon": {
    "url": "ipfs://bafkreif6anuffunp3le26jsyemdrg4ydf2abensokw4qnlgvg5nc43zqbi",
    "width": 3600,
    "height": 3600,
    "format": "PNG"
  },
  "infoURL": "https://info.form.network",
  "name": "Form Testnet",
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "networkId": 132902,
  "parent": {
    "type": "Optimism",
    "chain": "Optimism",
    "bridges": []
  },
  "redFlags": [],
  "rpc": [
    "https://form-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://132902.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.form.network/http"
  ],
  "shortName": "Form",
  "slug": "form-testnet",
  "testnet": true,
  "title": "https://explorer.form.network/"
} as const satisfies Chain;