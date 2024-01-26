import type { Chain } from "../src/types";
export default {
  "chain": "onus",
  "chainId": 1945,
  "explorers": [
    {
      "name": "Onus explorer testnet",
      "url": "https://explorer-testnet.onuschain.io",
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
  "name": "ONUS Chain Testnet",
  "nativeCurrency": {
    "name": "ONUS",
    "symbol": "ONUS",
    "decimals": 18
  },
  "networkId": 1945,
  "rpc": [
    "https://onus-chain-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://1945.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc-testnet.onuschain.io"
  ],
  "shortName": "onus-testnet",
  "slip44": 1,
  "slug": "onus-chain-testnet",
  "testnet": true,
  "title": "ONUS Chain Testnet"
} as const satisfies Chain;