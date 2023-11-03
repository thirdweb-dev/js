import type { Chain } from "../types";
export default {
  "chain": "HPN",
  "chainId": 400,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://testnet.hyperonchain.com",
      "standard": "EIP3091",
      "icon": {
        "url": "ipfs://QmWxhyxXTEsWH98v7M3ck4ZL1qQoUaHG4HgtgxzD2KJQ5m",
        "width": 540,
        "height": 541,
        "format": "png"
      }
    }
  ],
  "faucets": [
    "https://faucet.hyperonchain.com"
  ],
  "icon": {
    "url": "ipfs://QmWxhyxXTEsWH98v7M3ck4ZL1qQoUaHG4HgtgxzD2KJQ5m",
    "width": 540,
    "height": 541,
    "format": "png"
  },
  "infoURL": "https://docs.hyperonchain.com",
  "name": "HyperonChain TestNet",
  "nativeCurrency": {
    "name": "HyperonChain",
    "symbol": "HPN",
    "decimals": 18
  },
  "networkId": 400,
  "rpc": [
    "https://hyperonchain-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://400.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet-rpc.hyperonchain.com"
  ],
  "shortName": "hpn",
  "slug": "hyperonchain-testnet",
  "testnet": true
} as const satisfies Chain;