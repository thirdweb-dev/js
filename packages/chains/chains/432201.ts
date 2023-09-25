import type { Chain } from "../src/types";
export default {
  "chainId": 432201,
  "chain": "DEXALOT",
  "name": "Dexalot Subnet Testnet",
  "rpc": [
    "https://dexalot-subnet-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://subnets.avax.network/dexalot/testnet/rpc"
  ],
  "slug": "dexalot-subnet-testnet",
  "icon": {
    "url": "ipfs://QmfVxdrWjtUKiGzqFDzAxHH2FqwP2aRuZTGcYWdWg519Xy",
    "width": 256,
    "height": 256,
    "format": "png"
  },
  "faucets": [
    "https://faucet.avax.network/?subnet=dexalot"
  ],
  "nativeCurrency": {
    "name": "Dexalot",
    "symbol": "ALOT",
    "decimals": 18
  },
  "infoURL": "https://dexalot.com",
  "shortName": "dexalot-testnet",
  "testnet": true,
  "redFlags": [],
  "explorers": [
    {
      "name": "Avalanche Subnet Testnet Explorer",
      "url": "https://subnets-test.avax.network/dexalot",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;