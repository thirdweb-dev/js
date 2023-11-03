import type { Chain } from "../types";
export default {
  "chain": "onus",
  "chainId": 1975,
  "explorers": [
    {
      "name": "Onus explorer mainnet",
      "url": "https://explorer.onuschain.io",
      "standard": "EIP3091",
      "icon": {
        "url": "ipfs://bafkreiec34ik3glrm5jrzafdytvu4kxdsrxhqmagbe27fytdcuzkhoooay",
        "width": 512,
        "height": 512,
        "format": "png"
      }
    }
  ],
  "faucets": [],
  "infoURL": "https://onuschain.io",
  "name": "ONUS Chain Mainnet",
  "nativeCurrency": {
    "name": "ONUS",
    "symbol": "ONUS",
    "decimals": 18
  },
  "networkId": 1975,
  "rpc": [
    "https://onus-chain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://1975.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.onuschain.io",
    "wss://ws.onuschain.io"
  ],
  "shortName": "onus-mainnet",
  "slug": "onus-chain",
  "testnet": false,
  "title": "ONUS Chain Mainnet"
} as const satisfies Chain;