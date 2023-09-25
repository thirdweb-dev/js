import type { Chain } from "../src/types";
export default {
  "chainId": 400,
  "chain": "HPN",
  "name": "HyperonChain TestNet",
  "rpc": [
    "https://hyperonchain-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet-rpc.hyperonchain.com"
  ],
  "slug": "hyperonchain-testnet",
  "icon": {
    "url": "ipfs://QmWxhyxXTEsWH98v7M3ck4ZL1qQoUaHG4HgtgxzD2KJQ5m",
    "width": 540,
    "height": 541,
    "format": "png"
  },
  "faucets": [
    "https://faucet.hyperonchain.com"
  ],
  "nativeCurrency": {
    "name": "HyperonChain",
    "symbol": "HPN",
    "decimals": 18
  },
  "infoURL": "https://docs.hyperonchain.com",
  "shortName": "hpn",
  "testnet": true,
  "redFlags": [],
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://testnet.hyperonchain.com",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;