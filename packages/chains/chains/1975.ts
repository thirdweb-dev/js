import type { Chain } from "../src/types";
export default {
  "name": "ONUS Chain Mainnet",
  "title": "ONUS Chain Mainnet",
  "chain": "onus",
  "rpc": [
    "https://onus-chain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.onuschain.io",
    "wss://ws.onuschain.io"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "ONUS",
    "symbol": "ONUS",
    "decimals": 18
  },
  "infoURL": "https://onuschain.io",
  "shortName": "onus-mainnet",
  "chainId": 1975,
  "networkId": 1975,
  "explorers": [
    {
      "name": "Onus explorer mainnet",
      "url": "https://explorer.onuschain.io",
      "icon": {
        "url": "ipfs://bafkreiec34ik3glrm5jrzafdytvu4kxdsrxhqmagbe27fytdcuzkhoooay",
        "width": 512,
        "height": 512,
        "format": "png"
      },
      "standard": "EIP3091"
    }
  ],
  "testnet": false,
  "slug": "onus-chain"
} as const satisfies Chain;