import type { Chain } from "../src/types";
export default {
  "chain": "Form",
  "chainId": 132902,
  "explorers": [
    {
      "name": "Form Testnet explorer",
      "url": "https://testnet-explorer.form.network",
      "standard": "EIP3091"
    }
  ],
  "faucets": [
    "https://info.form.network/faucet"
  ],
  "features": [
    {
      "name": "EIP155"
    },
    {
      "name": "EIP1559"
    }
  ],
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
    "https://132902.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.form.network/http",
    "https://testnet-rpc.form.network/http",
    "wss://testnet-rpc.form.network/ws"
  ],
  "shortName": "Form",
  "slug": "form-testnet",
  "testnet": true,
  "title": "https://explorer.form.network/"
} as const satisfies Chain;