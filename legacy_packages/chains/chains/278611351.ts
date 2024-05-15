import type { Chain } from "../src/types";
export default {
  "chain": "Razor Schain",
  "chainId": 278611351,
  "explorers": [
    {
      "name": "turbulent-unique-scheat",
      "url": "https://turbulent-unique-scheat.explorer.mainnet.skalenodes.com",
      "standard": "EIP3091"
    }
  ],
  "faucets": [
    "https://faucet.razorscan.io/"
  ],
  "icon": {
    "url": "ipfs://QmUdwAZJfyKGZnfPGDsCnNvGu123mdd57kTGj1Y3EWVuWK",
    "width": 900,
    "height": 900,
    "format": "png"
  },
  "infoURL": "https://razor.network",
  "name": "Razor Skale Chain",
  "nativeCurrency": {
    "name": "sFuel",
    "symbol": "SFUEL",
    "decimals": 18
  },
  "networkId": 278611351,
  "rpc": [
    "https://278611351.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet.skalenodes.com/v1/turbulent-unique-scheat"
  ],
  "shortName": "razor",
  "slug": "razor-skale-chain",
  "testnet": false
} as const satisfies Chain;