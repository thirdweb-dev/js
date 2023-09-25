import type { Chain } from "../src/types";
export default {
  "chainId": 278611351,
  "chain": "Razor Schain",
  "name": "Razor Skale Chain",
  "rpc": [
    "https://razor-skale-chain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet.skalenodes.com/v1/turbulent-unique-scheat"
  ],
  "slug": "razor-skale-chain",
  "icon": {
    "url": "ipfs://QmUdwAZJfyKGZnfPGDsCnNvGu123mdd57kTGj1Y3EWVuWK",
    "width": 900,
    "height": 900,
    "format": "png"
  },
  "faucets": [
    "https://faucet.razorscan.io/"
  ],
  "nativeCurrency": {
    "name": "sFuel",
    "symbol": "SFUEL",
    "decimals": 18
  },
  "infoURL": "https://razor.network",
  "shortName": "razor",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "turbulent-unique-scheat",
      "url": "https://turbulent-unique-scheat.explorer.mainnet.skalenodes.com",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;