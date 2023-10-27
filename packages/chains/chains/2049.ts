import type { Chain } from "../src/types";
export default {
  "chain": "MOVO",
  "chainId": 2049,
  "explorers": [
    {
      "name": "movoscan",
      "url": "https://movoscan.com",
      "standard": "none",
      "icon": {
        "url": "ipfs://QmdFJMdnTvu4adiMERMP7B5ZZDwgiPmU3kU1qrUFdvHmUY",
        "width": 800,
        "height": 800,
        "format": "png"
      }
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://QmSQGKhhBpMTM7vYpGdgMTDFyzaAN3PGG5AnmWy7KQPdSn",
    "width": 1200,
    "height": 1200,
    "format": "png"
  },
  "infoURL": "https://movo.uk",
  "name": "Movo Smart Chain Mainnet",
  "nativeCurrency": {
    "name": "Movo Smart Chain",
    "symbol": "MOVO",
    "decimals": 18
  },
  "networkId": 2049,
  "rpc": [
    "https://movo-smart-chain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://2049.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://msc-rpc.movoscan.com",
    "https://msc-rpc.movochain.org",
    "https://msc-rpc.movoswap.com"
  ],
  "shortName": "movo",
  "slip44": 2050,
  "slug": "movo-smart-chain",
  "testnet": false
} as const satisfies Chain;