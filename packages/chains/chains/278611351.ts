import type { Chain } from "../src/types";
export default {
  "name": "Razor Skale Chain",
  "chain": "Razor Schain",
  "icon": {
    "url": "ipfs://QmUdwAZJfyKGZnfPGDsCnNvGu123mdd57kTGj1Y3EWVuWK",
    "width": 900,
    "height": 900,
    "format": "png"
  },
  "rpc": [
    "https://razor-skale-chain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet.skalenodes.com/v1/turbulent-unique-scheat"
  ],
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
  "chainId": 278611351,
  "networkId": 278611351,
  "explorers": [
    {
      "name": "turbulent-unique-scheat",
      "url": "https://turbulent-unique-scheat.explorer.mainnet.skalenodes.com",
      "standard": "EIP3091"
    }
  ],
  "testnet": false,
  "slug": "razor-skale-chain"
} as const satisfies Chain;