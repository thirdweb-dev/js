import type { Chain } from "../types";
export default {
  "chain": "DEXALOT",
  "chainId": 432204,
  "explorers": [
    {
      "name": "Avalanche Subnet Explorer",
      "url": "https://subnets.avax.network/dexalot",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://QmfVxdrWjtUKiGzqFDzAxHH2FqwP2aRuZTGcYWdWg519Xy",
    "width": 256,
    "height": 256,
    "format": "png"
  },
  "infoURL": "https://dexalot.com",
  "name": "Dexalot Subnet",
  "nativeCurrency": {
    "name": "Dexalot",
    "symbol": "ALOT",
    "decimals": 18
  },
  "networkId": 432204,
  "rpc": [
    "https://dexalot-subnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://432204.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://subnets.avax.network/dexalot/mainnet/rpc"
  ],
  "shortName": "dexalot",
  "slug": "dexalot-subnet",
  "testnet": false
} as const satisfies Chain;