import type { Chain } from "../src/types";
export default {
  "name": "ONUS Chain Testnet",
  "title": "ONUS Chain Testnet",
  "chain": "onus",
  "rpc": [
    "https://onus-chain-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc-testnet.onuschain.io"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "ONUS",
    "symbol": "ONUS",
    "decimals": 18
  },
  "infoURL": "https://onuschain.io",
  "shortName": "onus-testnet",
  "chainId": 1945,
  "networkId": 1945,
  "explorers": [
    {
      "name": "Onus explorer testnet",
      "url": "https://explorer-testnet.onuschain.io",
      "icon": {
        "url": "ipfs://bafkreiec34ik3glrm5jrzafdytvu4kxdsrxhqmagbe27fytdcuzkhoooay",
        "width": 512,
        "height": 512,
        "format": "png"
      },
      "standard": "EIP3091"
    }
  ],
  "testnet": true,
  "slug": "onus-chain-testnet"
} as const satisfies Chain;