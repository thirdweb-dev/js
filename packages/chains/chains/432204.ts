import type { Chain } from "../src/types";
export default {
  "chainId": 432204,
  "chain": "DEXALOT",
  "name": "Dexalot Subnet",
  "rpc": [
    "https://dexalot-subnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://subnets.avax.network/dexalot/mainnet/rpc"
  ],
  "slug": "dexalot-subnet",
  "icon": {
    "url": "ipfs://QmfVxdrWjtUKiGzqFDzAxHH2FqwP2aRuZTGcYWdWg519Xy",
    "width": 256,
    "height": 256,
    "format": "png"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "Dexalot",
    "symbol": "ALOT",
    "decimals": 18
  },
  "infoURL": "https://dexalot.com",
  "shortName": "dexalot",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "Avalanche Subnet Explorer",
      "url": "https://subnets.avax.network/dexalot",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;